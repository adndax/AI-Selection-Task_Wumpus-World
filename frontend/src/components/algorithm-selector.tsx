interface AlgorithmSelectorProps {
  selectedAlgorithm: 'qlearning' | 'sarsa';
  onSelect: (algorithm: 'qlearning' | 'sarsa') => void;
}

export default function AlgorithmSelector({ selectedAlgorithm, onSelect }: AlgorithmSelectorProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => onSelect('qlearning')}
        className={`px-6 py-3 lg:px-3 font-bold transition-all duration-200 border-2 rounded-lg ${
          selectedAlgorithm === 'qlearning'
            ? 'bg-yellow-500 text-black border-yellow-400'
            : 'bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-500/10'
        }`}
      >
        Q-Learning
      </button>
      
      <button
        onClick={() => onSelect('sarsa')}
        className={`px-6 py-3 lg:px-3 font-bold transition-all duration-200 border-2 rounded-lg ${
          selectedAlgorithm === 'sarsa'
            ? 'bg-yellow-500 text-black border-yellow-400'
            : 'bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-500/10'
        }`}
      >
        SARSA
      </button>
    </div>
  );
}