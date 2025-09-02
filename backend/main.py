from flask import Flask, request, jsonify
from flask_cors import CORS
from core.environment import Environment, Action, Direction
from core.agents import QLearningAgent, SARSAAgent
from core.state_encoder import StateEncoder
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)

def get_policy_summary(policy):
    if not policy:
        return {"total_states": 0, "action_distribution": {}}
    
    action_counts = {}
    total_states = len(policy)
    q_values = []
    
    for state_info in policy.values():
        best_action = state_info['best_action']
        action_counts[best_action] = action_counts.get(best_action, 0) + 1
        q_values.append(state_info['best_q_value'])
    
    action_distribution = {
        action: {
            'count': count,
            'percentage': round((count / total_states) * 100, 2)
        }
        for action, count in action_counts.items()
    }
    
    return {
        'total_states': total_states,
        'action_distribution': action_distribution,
        'q_value_stats': {
            'mean': float(np.mean(q_values)) if q_values else 0,
            'std': float(np.std(q_values)) if q_values else 0,
            'min': float(np.min(q_values)) if q_values else 0,
            'max': float(np.max(q_values)) if q_values else 0
        }
    }

def train_agent(agent, env, encoder, episodes):
    for episode in range(episodes):
        state = env.reset()
        encoded_state = encoder.encode(state)
        done = False
        
        if isinstance(agent, SARSAAgent):
            action = agent.choose_action(encoded_state)
        
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

        agent.decay_epsilon()
    
    return agent.q_table

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
        
        if encoded_state in visited_states or encoded_state not in q_table:
            break
            
        visited_states.add(encoded_state)
        
        q_values = q_table[encoded_state]
        best_action_value = np.argmax(q_values)
        best_action = Action(best_action_value)
        
        state, _, done, _ = env.step(best_action)
        
        path.append({
            'position': list(state[0]),
            'action': best_action.name,
            'direction': Direction(state[1]).name
        })
    
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
    
    q_table = train_agent(agent, env, encoder, episodes)
    optimal_path = find_optimal_path(q_table, encoder, env)
    serializable_q_table = agent.get_final_q_table()
    policy = agent.get_policy()  
    policy_summary = get_policy_summary(policy)
    
    return jsonify({
        'success': True,
        'message': f'Training with {algorithm_name.upper()} completed.',
        'results': {
            'q_table': serializable_q_table,
            'policy': policy,
            'policy_summary': policy_summary,
            'optimal_path': optimal_path,
            'training_info': {
                'algorithm': algorithm_name.upper(),
                'episodes': episodes,
                'final_epsilon': float(agent.epsilon),
                'states_explored': len(q_table)
            }
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)