from flask import Flask, request, jsonify
from flask_cors import CORS
from core.environment import Environment, Action
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
    return agent.get_final_q_table(), training_log

def find_optimal_path(q_table, encoder, env):
    path = []
    state = env.reset()
    path.append(list(state[0]))
    done = False
    
    while not done:
        encoded_state = encoder.encode(state)
        if str(encoded_state) not in q_table:
            break
        
        q_values = q_table[str(encoded_state)]
        best_action_value = np.argmax(q_values)
        best_action = Action(best_action_value)
        
        state, _, done, _ = env.step(best_action)
        path.append(list(state[0]))
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
    
    if algorithm_name == 'qlearning':
        agent = QLearningAgent(learning_rate, discount_factor, epsilon)
    elif algorithm_name == 'sarsa':
        agent = SARSAAgent(learning_rate, discount_factor, epsilon)
    else:
        return jsonify({'success': False, 'error': 'Invalid algorithm specified'}), 400
    
    q_table, training_log = train_agent(agent, env, encoder, episodes)
    optimal_path = find_optimal_path(q_table, encoder, env)
    
    return jsonify({
        'success': True,
        'message': f'Training with {algorithm_name.upper()} completed.',
        'q_table': q_table,
        'optimal_path': optimal_path
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)