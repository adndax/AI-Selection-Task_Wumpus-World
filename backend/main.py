from flask import Flask, request, jsonify
from flask_cors import CORS
from core.environment import Environment, Action, Direction
from core.agents.qlearning import QLearningAgent
from core.agents.sarsa import SARSAAgent
from core.state_encoder import StateEncoder
import numpy as np
import json

app = Flask(__name__)
CORS(app)

def train_agent(agent, env, encoder, episodes):
    training_log = []
    
    for episode in range(episodes):
        state = env.reset()
        encoded_state = encoder.encode(state)
        done = False
        
        if isinstance(agent, SARSAAgent):
            action = agent.choose_action(encoded_state)
        
        total_reward = 0
        
        while not done:
            if isinstance(agent, QLearningAgent):
                action = agent.choose_action(encoded_state)
            
            next_state, reward, done, info = env.step(action)
            next_encoded_state = encoder.encode(next_state)
            
            if isinstance(agent, QLearningAgent):
                agent.update(encoded_state, action, reward, next_encoded_state, done)
            elif isinstance(agent, SARSAAgent):
                next_action = agent.choose_action(next_encoded_state)
                agent.update(encoded_state, action, reward, next_encoded_state, next_action, done)
                action = next_action
            
            encoded_state = next_encoded_state
            total_reward += reward

        agent.decay_epsilon()
        training_log.append(total_reward)
    return agent.q_table, training_log

def find_optimal_path(q_table, encoder, env):
    path = []
    state = env.reset()
    
    path.append({
        'position': list(state[0]), 
        'action': 'Start', 
        'direction': Direction(state[1]).name
    })
    done = False
    visited_states = set() 
    
    while not done:
        encoded_state = encoder.encode(state)
        
        if encoded_state in visited_states:
            break
            
        visited_states.add(encoded_state)
        
        if encoded_state not in q_table:
            break
        
        q_values = q_table[encoded_state]
        best_action_value = np.argmax(q_values)
        best_action = Action(best_action_value)
        
        state, _, done, _ = env.step(best_action)
        
        path.append({
            'position': list(state[0]),
            'action': best_action.name,
            'direction': Direction(state[1]).name
        })
        
        if done:
            break
    
    return path

@app.route('/api/train', methods=['POST'])
def handle_train_request():
    
    data = request.json
    algorithm_name = data.get('algorithm')
    hyperparams = data.get('hyperparams')
    
    env = Environment()
    encoder = StateEncoder()
    
    learning_rate = hyperparams['learningRate']
    discount_factor = hyperparams['discountFactor']
    epsilon = hyperparams['epsilon']
    episodes = hyperparams['episodes']
    
    epsilon_decay = 0.999 if episodes > 1000 else 0.995
    epsilon_min = 0.1  
    
    if algorithm_name == 'qlearning':
        agent = QLearningAgent(learning_rate, discount_factor, epsilon, epsilon_decay, epsilon_min)
    elif algorithm_name == 'sarsa':
        agent = SARSAAgent(learning_rate, discount_factor, epsilon, epsilon_decay, epsilon_min)
    else:
        return jsonify({'success': False, 'error': 'Invalid algorithm specified'}), 400
    
    q_table, training_log = train_agent(agent, env, encoder, episodes)
    optimal_path = find_optimal_path(q_table, encoder, env)
    serializable_q_table = agent.get_final_q_table()
    
    return jsonify({
        'success': True,
        'message': f'Training with {algorithm_name.upper()} completed.',
        'q_table': serializable_q_table,
        'optimal_path': optimal_path
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)