import numpy as np
import random
from core.environment import Action

class BaseAgent:
    def __init__(self, learning_rate, discount_factor, epsilon, epsilon_decay, epsilon_min):
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min
        self.q_table = {}
        self.actions = list(Action)

    def get_q_values(self, state):
        if state not in self.q_table:
            self.q_table[state] = np.zeros(len(self.actions))
        return self.q_table[state]

    def choose_action(self, state):
        if random.random() < self.epsilon:
            return random.choice(self.actions)
        else:
            q_values = self.get_q_values(state)
            max_q = np.max(q_values)
            best_actions = [self.actions[i] for i, q in enumerate(q_values) if q == max_q]
            return random.choice(best_actions)

    def get_best_action(self, state):
        q_values = self.get_q_values(state)
        best_action_idx = np.argmax(q_values)
        return Action(best_action_idx), q_values[best_action_idx]

    def get_policy(self):
        policy = {}
        for state, q_values in self.q_table.items():
            best_action_idx = int(np.argmax(q_values))
            best_action = Action(best_action_idx)

            policy[str(state)] = {
                'best_action': best_action.name,
                'best_q_value': float(q_values[best_action_idx]),
                'all_q_values': {Action(i).name: float(q_val) for i, q_val in enumerate(q_values)}
            }
        return policy

    def decay_epsilon(self):
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)
        
    def get_final_q_table(self):
        return {str(k): v.tolist() for k, v in self.q_table.items()}

class QLearningAgent(BaseAgent):
    def update(self, state, action, reward, next_state, done):
        current_q = self.get_q_values(state)[action.value]
        
        if done:
            target_q = reward
        else:
            max_next_q = np.max(self.get_q_values(next_state))
            target_q = reward + self.discount_factor * max_next_q
        
        new_q = current_q + self.learning_rate * (target_q - current_q)
        self.get_q_values(state)[action.value] = new_q

class SARSAAgent(BaseAgent):
    def update(self, state, action, reward, next_state, next_action, done):
        current_q = self.get_q_values(state)[action.value]
        
        if done:
            target_q = reward
        else:
            next_q = self.get_q_values(next_state)[next_action.value]
            target_q = reward + self.discount_factor * next_q
        
        new_q = current_q + self.learning_rate * (target_q - current_q)
        self.get_q_values(state)[action.value] = new_q