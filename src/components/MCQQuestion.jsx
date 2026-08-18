import OptionButton from './OptionButton'
import { optionState } from './optionState'

// Classic multiple-choice: four options, tap one to answer.
export default function MCQQuestion({ question, phase, response, onAnswer }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {question.options.map((opt) => (
        <OptionButton
          key={opt}
          label={opt}
          state={optionState(opt, { phase, response, answer: question.answer })}
          disabled={phase === 'feedback'}
          onClick={() => onAnswer(opt)}
        />
      ))}
    </div>
  )
}
