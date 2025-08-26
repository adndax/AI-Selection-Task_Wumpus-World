import numpy as np
from enum import Enum

class Action(Enum):
    FORWARD = 0
    TURN_LEFT = 1
    TURN_RIGHT = 2
    GRAB = 3
    CLIMB = 4

class Direction(Enum):
    NORTH = 0
    EAST = 1
    SOUTH = 2
    WEST = 3

class Environment:
    def __init__(self):
        self.grid_size = 4
        self.wumpus_position = [1, 3]
        self.gold_position = [2, 3]
        self.pit_positions = [[3, 1], [3, 3], [4, 4]]
        self.reset()

    def reset(self):
        self.agent_position = [1, 1]
        self.agent_direction = Direction.EAST
        self.step_count = 0
        self.has_gold = False
        self.is_alive = True
        self.game_over = False
        
        return self.get_state()
    
    def get_state(self):
        percepts = self.get_percepts()
        state = (
            tuple(self.agent_position),
            self.agent_direction.value,
            self.has_gold,
            percepts['stench'],
            percepts['breeze'],
            percepts['glitter']
        )
        return state
    
    def get_percepts(self):
        percepts = {
            'stench': self.is_adjacent(self.agent_position, self.wumpus_position),
            'breeze': any(self.is_adjacent(self.agent_position, pit) for pit in self.pit_positions),
            'glitter': self.agent_position == self.gold_position
        }
        return percepts
    
    def is_adjacent(self, pos1, pos2):
        return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1]) == 1
    
    def is_valid_position(self, position):
        x, y = position
        return (1 <= x <= self.grid_size) and (1 <= y <= self.grid_size)
    
    def get_valid_actions(self):
        return [Action.FORWARD, Action.TURN_LEFT, Action.TURN_RIGHT, Action.GRAB, Action.CLIMB]

    def forward(self):
        x, y = self.agent_position
        if self.agent_direction == Direction.NORTH:
            new_position = [x, y + 1]
        elif self.agent_direction == Direction.EAST:
            new_position = [x + 1, y]
        elif self.agent_direction == Direction.SOUTH:
            new_position = [x, y - 1]
        else: # West
            new_position = [x - 1, y]
        
        if self.is_valid_position(new_position):
            self.agent_position = new_position

    def turn_left(self):
        self.agent_direction = Direction((self.agent_direction.value - 1) % 4)
    
    def turn_right(self):
        self.agent_direction = Direction((self.agent_direction.value + 1) % 4)
    
    def grab_gold(self):
        if self.agent_position == self.gold_position and not self.has_gold:
            self.has_gold = True
            return 1000
        return 0

    def step(self, action):
        reward = -1
        info = {'reason': 'still_playing'}

        if action == Action.FORWARD:
            self.forward()
        elif action == Action.TURN_LEFT:
            self.turn_left()
        elif action == Action.TURN_RIGHT:
            self.turn_right()
        elif action == Action.GRAB:
            reward = self.grab_gold()
        elif action == Action.CLIMB:
            if self.agent_position == [1, 1] and self.has_gold:
                self.game_over = True
                info['reason'] = 'success'
            else:
                reward = -1
        
        if self.agent_position == self.wumpus_position:
            reward = -1000
            self.is_alive = False
            self.game_over = True
            info['reason'] = 'killed_by_wumpus'
        elif self.agent_position in self.pit_positions:
            reward = -1000
            self.is_alive = False
            self.game_over = True
            info['reason'] = 'fell_in_pit'
        
        self.step_count += 1
        return self.get_state(), reward, self.game_over, info