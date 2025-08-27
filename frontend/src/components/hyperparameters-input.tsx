interface HyperparameterPanelProps {
  hyperparams: {
    learningRate: number;
    discountFactor: number;
    epsilon: number;
    episodes: number;
  };
  onChange: (params: {
    learningRate: number;
    discountFactor: number;
    epsilon: number;
    episodes: number;
  }) => void;
}

export default function HyperparameterPanel({ hyperparams, onChange }: HyperparameterPanelProps) {
  const handleChange = (key: string, value: number) => {
    onChange({
      ...hyperparams,
      [key]: value
    });
  };

  return (
    <div className="font-poppins text-white/90 text-xs space-y-3">
      <div>
        <label className="block text-white font-semibold text-xs mb-1">
          Learning Rate (α): {hyperparams.learningRate}
        </label>
        <input
          type="range"
          min="0.01"
          max="1"
          step="0.01"
          value={hyperparams.learningRate}
          onChange={(e) => handleChange('learningRate', parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <p className="text-xs text-white/70 mt-1">Controls how much new information updates the Q-value</p>
      </div>

      <div>
        <label className="block text-white font-semibold text-xs mb-1">
          Discount Factor (γ): {hyperparams.discountFactor}
        </label>
        <input
          type="range"
          min="0.1"
          max="0.99"
          step="0.01"
          value={hyperparams.discountFactor}
          onChange={(e) => handleChange('discountFactor', parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <p className="text-xs text-white/70 mt-1">Determines the importance of future rewards</p>
      </div>

      <div>
        <label className="block text-white font-semibold text-xs mb-1">
          Exploration Probability (ε): {hyperparams.epsilon}
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={hyperparams.epsilon}
          onChange={(e) => handleChange('epsilon', parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <p className="text-xs text-white/70 mt-1">Likelihood of random action vs best-known action</p>
      </div>

      <div>
        <label className="block text-white font-semibold text-xs mb-1">
          Episodes: {hyperparams.episodes}
        </label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={hyperparams.episodes}
          onChange={(e) => handleChange('episodes', parseInt(e.target.value))}
          className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
        />
        <p className="text-xs text-white/70 mt-1">Total iterations for training</p>
      </div>
    </div>
  );
}