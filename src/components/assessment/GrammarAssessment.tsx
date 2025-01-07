'use client'

import { useState } from 'react'
import type { GrammarQuestion } from '@/lib/types/assessment'

interface Props {
  question: GrammarQuestion
  onSubmit: (answer: { selectedOptions: string[] }) => void
}

export default function GrammarAssessment({ question, onSubmit }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleOptionSelect = (option: string, index: number) => {
    const newSelectedOptions = [...selectedOptions]
    newSelectedOptions[index] = option
    setSelectedOptions(newSelectedOptions)
  }

  const handleSubmit = () => {
    if (selectedOptions.length !== (question.blanks?.length || 1)) return
    onSubmit({ selectedOptions })
  }

  const renderSentenceWithBlanks = () => {
    if (!question.sentence || !question.blanks) {
      return null
    }

    const parts = []
    let lastIndex = 0

    question.blanks.forEach((blankIndex, i) => {
      // Add text before blank
      parts.push(question.sentence!.slice(lastIndex, blankIndex))

      // Add dropdown for blank
      parts.push(
        <select
          key={`blank-${i}`}
          value={selectedOptions[i] || ''}
          onChange={(e) => handleOptionSelect(e.target.value, i)}
          className="mx-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select...</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )

      lastIndex = blankIndex
    })

    // Add remaining text
    parts.push(question.sentence.slice(lastIndex))

    return <div className="text-lg space-x-2">{parts}</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium text-gray-900 mb-4">
        {question.content}
      </div>

      {question.sentence ? (
        // Fill in the blanks mode
        <div className="mt-6 space-y-4">{renderSentenceWithBlanks()}</div>
      ) : (
        // Multiple choice mode
        <div className="mt-6 space-y-4">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOptions[0] === option
                  ? 'border-primary-dark bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="grammar-answer"
                value={option}
                checked={selectedOptions[0] === option}
                onChange={() => setSelectedOptions([option])}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-3">{option}</span>
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}
