class StateEncoder:
    def __init__(self):
        self.states_map = {}
        self.state_counter = 0

    def encode(self, state):
        return tuple(state)

    def get_state_space_size(self):
        return self.state_counter
    
    def decode(self, encoded_state):
        for state, enc in self.states_map.items():
            if enc == encoded_state:
                return state
        return None