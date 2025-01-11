'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Reorder, motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, HelpCircle } from 'lucide-react'
import dictionary from '@/app/dictionary.json'

interface LetterItem {
  id: string;
  letter: string;
  originalIndex: number;
}

interface DictionaryEntry {
  word: string;
  wordLength: number;
  hint: string;
  sentence: string;
}

const DraggableWords: React.FC = () => {
  const randomizedDictionary = useMemo(() => {
    return [...dictionary].sort(() => Math.random() - 0.5)
  }, [])

  const words = useMemo(() => randomizedDictionary.map(entry => entry.word), [randomizedDictionary])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [items, setItems] = useState<LetterItem[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentHint, setCurrentHint] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [isDragDisabled, setIsDragDisabled] = useState(false)
  const [moves, setMoves] = useState(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const initializeWord = (word: string) => {
    return word.toUpperCase().split('').map((letter, index) => ({
      id: `${index}-${letter}`,
      letter,
      originalIndex: index
    }))
  }

  const scrambleWord = (letterItems: LetterItem[], currentEntry: DictionaryEntry) => {
    if (letterItems.length <= 2) return letterItems;
    
    // Get the hint pattern from the dictionary entry
    const hintPattern = currentEntry.hint.toUpperCase();
    
    // Create a mapping of letters to their positions based on the hint pattern
    const scrambledItems: LetterItem[] = [];
    for (let i = 0; i < hintPattern.length; i++) {
      // Find the letter item that matches the hint pattern letter
      const matchingItem = letterItems.find(item => 
        item.letter === hintPattern[i] && !scrambledItems.includes(item)
      );
      if (matchingItem) {
        scrambledItems.push(matchingItem);
      }
    }
    
    return scrambledItems;
  };

  const handleReorder = (reorderedItems: LetterItem[]) => {
    const firstLetter = items[0];
    const lastLetter = items[items.length - 1];
    const reorderedMiddle = reorderedItems.filter(
      item => item.id !== firstLetter.id && item.id !== lastLetter.id
    );
    const newItems = [firstLetter, ...reorderedMiddle, lastLetter];
    setItems(newItems);

    // Update hint sentence with current arrangement
    const currentEntry = randomizedDictionary[currentWordIndex];
    const currentArrangement = newItems.map(item => item.letter).join('').toLowerCase();
    const sentence = currentEntry.sentence;
    const hintWord = currentEntry.hint;
    
    const regex = new RegExp(`(${hintWord})`, 'gi');
    const formattedSentence = sentence.replace(regex, `<strong>${currentArrangement}</strong>`);
    setCurrentHint(formattedSentence);
  };

  const checkCorrectness = () => {
    const currentWord = items.map(item => item.letter).join('');
    const correctWord = words[currentWordIndex].toUpperCase();
    if (currentWord === correctWord) {
      setIsCorrect(true);
      setIsTimerRunning(false);
      const timeout = setTimeout(() => {
        setIsDragDisabled(true);
      }, 1500);
      setTimeoutId(timeout);
    }
  };

  useEffect(() => {
    const currentEntry = randomizedDictionary[currentWordIndex];
    const initialItems = initializeWord(words[currentWordIndex]);
    const scrambledItems = scrambleWord(initialItems, currentEntry);
    setItems(scrambledItems);
    setIsCorrect(false);
    setTimer(0);
    setIsTimerRunning(true);
    setMoves(0);
    setIsDragDisabled(false);
    
    const sentence = currentEntry.sentence;
    const initialArrangement = scrambledItems.map(item => item.letter).join('').toLowerCase();
    
    const regex = new RegExp(`(${currentEntry.hint})`, 'gi');
    const formattedSentence = sentence.replace(regex, `<strong>${initialArrangement}</strong>`);
    
    setCurrentHint(formattedSentence);
  }, [currentWordIndex, words, randomizedDictionary]);

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
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    setShowHint(false);
    setIsDragDisabled(false);
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <AnimatePresence>
      <motion.div 
        className="h-[100dvh] w-full p-2 sm:p-24 overflow-hidden fixed inset-0"
        animate={{ backgroundColor: isCorrect ? '#70e000' : '#ffffff' }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-8">
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-500 ${isCorrect ? 'text-white' : 'text-[#008000]'}`}>
            What&apos;s the Word?
          </h1>

          <div className={`flex items-center space-x-2 rounded-full px-4 py-2 shadow-md transition-colors duration-500 ${
            isCorrect ? 'bg-[#008000] text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="text-xl font-semibold">{formatTime(timer)}</span>
          </div>

          <div className={`mt-2 flex items-center space-x-2 rounded-full px-4 py-2 shadow-md transition-colors duration-500 ${
            isCorrect ? 'bg-[#008000] text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            <span className="text-xl font-semibold">Moves: {moves}</span>
          </div>
        </div>

        <div className="h-full flex flex-col items-center justify-center">
          {items.length > 0 && (
            <Reorder.Group 
              axis="x"
              values={items.slice(1, -1)} 
              onReorder={(reorderedItems) => handleReorder(reorderedItems)}
              className="w-full max-w-[95vw] sm:max-w-[600px] flex justify-center gap-[1vw] sm:gap-4 mb-8"
            >
              <div key={items[0].id}>
                <Card className={`w-[10vw] h-[13vw] sm:w-16 sm:h-20 flex items-center justify-center transition-colors duration-500 border-2
                  bg-gray-100 min-w-[30px]
                  ${isCorrect ? 'bg-[#008000] border-[#008000]' : 'border-gray-200'}`}>
                  <CardContent className={`p-0 text-[3vw] sm:text-3xl font-bold ${isCorrect ? 'text-white' : ''}`}>
                    {items[0].letter}
                  </CardContent>
                </Card>
              </div>

              {items.slice(1, -1).map((item) => (
                <Reorder.Item 
                  key={item.id} 
                  value={item}
                  drag={!isDragDisabled ? "x" : false}
                  dragMomentum={false}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                  onDragEnd={() => {
                    setMoves(prev => prev + 1);
                    checkCorrectness();
                  }}
                >
                  <motion.div
                    className={`${!isDragDisabled ? 'cursor-move' : 'cursor-default'}`}
                    whileDrag={{
                      scale: 1.1,
                      zIndex: 1,
                      boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
                    }}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0 }}
                    animate={isCorrect ? { scale: 1 } : undefined}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className={`w-[10vw] h-[13vw] sm:w-16 sm:h-20 flex items-center justify-center transition-colors duration-500 border-2 min-w-[30px]
                      ${isCorrect ? 'bg-[#008000] border-[#008000]' : 'border-gray-200'}`}>
                      <CardContent className={`p-0 text-[3vw] sm:text-3xl font-bold ${isCorrect ? 'text-white' : ''}`}>
                        {item.letter}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Reorder.Item>
              ))}

              <div key={items[items.length - 1].id}>
                <Card className={`w-[10vw] h-[13vw] sm:w-16 sm:h-20 flex items-center justify-center transition-colors duration-500 border-2
                  bg-gray-100 min-w-[30px]
                  ${isCorrect ? 'bg-[#008000] border-[#008000]' : 'border-gray-200'}`}>
                  <CardContent className={`p-0 text-[3vw] sm:text-3xl font-bold ${isCorrect ? 'text-white' : ''}`}>
                    {items[items.length - 1].letter}
                  </CardContent>
                </Card>
              </div>
            </Reorder.Group>
          )}

          <Button
            onClick={handleNextWord}
            className={`mt-4 transition-all duration-300 ${
              isCorrect 
                ? 'opacity-100 visible bg-[#008000] text-white hover:bg-[#006400]' 
                : 'opacity-0 invisible'
            }`}
          >
            Next
          </Button>
        </div>

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
              >
              </motion.p>
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

      </motion.div>
    </AnimatePresence>
  )
}

export default DraggableWords

