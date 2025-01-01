'use client'

import React, { useState, useEffect } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

interface LetterItem {
  id: string;
  letter: string;
  originalIndex: number;
}

const DraggableWords: React.FC = () => {
  const words = ['Harmony', 'Elephant', 'Lantern', 'Orchard', 'Journey']
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [items, setItems] = useState<LetterItem[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const initializeWord = (word: string) => {
    return word.toUpperCase().split('').map((letter, index) => ({
      id: `${index}-${letter}`,
      letter,
      originalIndex: index
    }))
  }

  const scrambleWord = (letterItems: LetterItem[]) => {
    if (letterItems.length <= 2) return letterItems;
    const middleLetters = letterItems.slice(1, -1);
    const scrambledMiddle = [...middleLetters].sort(() => Math.random() - 0.5);
    return [letterItems[0], ...scrambledMiddle, letterItems[letterItems.length - 1]];
  }

  useEffect(() => {
    const initialItems = initializeWord(words[currentWordIndex])
    setItems(scrambleWord(initialItems))
    setIsCorrect(false)
    setTimer(0)
    setIsTimerRunning(true)
  }, [currentWordIndex])

  useEffect(() => {
    const currentWord = items.map(item => item.letter).join('')
    const correctWord = words[currentWordIndex].toUpperCase()
    if (currentWord === correctWord) {
      setIsCorrect(true)
      setIsTimerRunning(false)
    }
  }, [items, currentWordIndex, words])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning])

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    setIsCorrect(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-24"
        animate={{ backgroundColor: isCorrect ? '#70e000' : '#ffffff' }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-4xl font-bold mb-8 transition-colors duration-500 ${isCorrect ? 'text-white' : 'text-[#008000]'}`}>
          What's the Word?
        </h1>
        <div className={`mb-8 flex items-center space-x-2 rounded-full px-4 py-2 shadow-md transition-colors duration-500 ${isCorrect ? 'bg-[#008000] text-white' : 'bg-gray-100 text-gray-600'}`}>
          <Clock className="w-5 h-5" />
          <span className="text-xl font-semibold">{formatTime(timer)}</span>
        </div>
        <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex flex-wrap justify-center gap-4 mb-8">
          {items.map((item, index) => (
            <Reorder.Item key={item.id} value={item}>
              <motion.div
                className="cursor-move"
                whileDrag={{
                  scale: 1.1,
                  zIndex: 1,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className={`w-16 h-20 flex items-center justify-center transition-colors duration-500 border-2
                  ${index === 0 || index === items.length - 1 ? 'bg-gray-100' : ''}
                  ${isCorrect ? 'bg-[#008000] border-[#008000]' : 'border-gray-200'}`}>
                  <CardContent className={`p-0 text-3xl font-bold ${isCorrect ? 'text-white' : ''}`}>
                    {item.letter}
                  </CardContent>
                </Card>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        {isCorrect && (
          <Button
            onClick={handleNextWord}
            className="mt-4 bg-[#008000] text-white hover:bg-[#006400]"
          >
            Next
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default DraggableWords

