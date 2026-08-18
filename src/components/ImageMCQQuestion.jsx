import OptionButton from './OptionButton'
import { optionState } from './optionState'

// Like MCQ, but with a picture to look at above the options
// (e.g. "Which one is the Rashtrapati Bhavan?"). Falls back to a friendly
// placeholder until real artwork is added for the question.
export default function ImageMCQQuestion({ question, phase, response, onAnswer }) {
  return (
    <div className="grid gap-4">
      <div className="mx-auto w-full max-w-sm aspect-video rounded-3xl overflow-hidden bg-brand-mist border-4 border-white shadow-card flex items-center justify-center">
        {question.image ? (
          <img src={question.image} alt="Look at this picture" className="h-full w-full object-cover" />
        ) : (
          <span className="text-6xl" aria-hidden>🖼️</span>
        )}
      </div>
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
    </div>
  )
}
