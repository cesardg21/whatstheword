import { Clock } from 'lucide-react'

interface TimerProps {
  timer: number
  isCorrect: boolean
}

const Timer: React.FC<TimerProps> = ({ timer, isCorrect }) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`flex items-center space-x-2 rounded-full px-4 py-2 shadow-md transition-colors duration-500 ${
      isCorrect ? 'bg-[#008000] text-white' : 'bg-gray-100 text-gray-600'
    }`}>
      <Clock className="w-5 h-5" />
      <span className="text-xl font-semibold">{formatTime(timer)}</span>
    </div>
  )
}

export default Timer 