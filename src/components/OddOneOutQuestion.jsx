import OptionButton from './OptionButton'
import { optionState } from './optionState'

// "Spot the one that doesn't belong." Same tap-one interaction as MCQ,
// shown in a single column so each option reads clearly.
export default function OddOneOutQuestion({ question, phase, response, onAnswer }) {
  return (
    <div className="grid gap-3">
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
