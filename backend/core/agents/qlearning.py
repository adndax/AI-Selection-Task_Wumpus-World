import numpy as np
import random
from ..environment import Action

class QLearningAgent:
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

    def update(self, state, action, reward, next_state, done):
        current_q = self.get_q_values(state)[action.value]
        
        if done:
            target_q = reward
        else:
            max_next_q = np.max(self.get_q_values(next_state))
            target_q = reward + self.discount_factor * max_next_q
        
        new_q = current_q + self.learning_rate * (target_q - current_q)
        self.get_q_values(state)[action.value] = new_q

    def decay_epsilon(self):
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)
        
    def get_final_q_table(self):
        return {str(k): v.tolist() for k, v in self.q_table.items()}