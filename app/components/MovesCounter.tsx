'use client'

interface MovesCounterProps {
  moves: number
  isCorrect: boolean
}

const MovesCounter: React.FC<MovesCounterProps> = ({ moves, isCorrect }) => {
  return (
    <div className={`flex items-center space-x-2 rounded-full px-4 py-2 shadow-md transition-colors duration-500 ${
      isCorrect ? 'bg-[#008000] text-white' : 'bg-gray-100 text-gray-600'
    }`}>
      <span className="text-xl font-semibold">Moves: {moves}</span>
    </div>
  )
}

export default MovesCounter 