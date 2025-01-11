'use client'

import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HintButtonProps {
  showHint: boolean
  setShowHint: (show: boolean) => void
  currentHint: string
  isCorrect: boolean
}

const HintButton: React.FC<HintButtonProps> = ({
  showHint,
  setShowHint,
  currentHint,
  isCorrect,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-8">
      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-center max-w-xs text-lg font-medium px-4 py-2 mb-4 rounded-lg transition-colors duration-500 ${
              isCorrect ? 'text-white' : 'text-gray-700'
            }`}
            dangerouslySetInnerHTML={{ __html: currentHint }}
          />
        )}
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowHint(!showHint)}
        className={`${isCorrect ? 'bg-[#008000] hover:bg-[#008000]/90 border-[#008000]' : ''}`}
      >
        <HelpCircle className={`h-5 w-5 ${isCorrect ? 'text-white' : ''}`} />
      </Button>
    </div>
  )
}

export default HintButton 