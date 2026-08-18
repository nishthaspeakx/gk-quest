// Answer checking for every question type.
// `response` shape depends on the type:
//   mcq / truefalse / image_mcq / odd_one_out / fill_blank -> a string (the chosen option)
//   match    -> an object mapping each left -> chosen right, e.g. { "Punjab": "Chandigarh" }
//   sequence -> an ordered array of the items

export function isCorrect(question, response) {
  if (response == null) return false

  switch (question.type) {
    case 'mcq':
    case 'truefalse':
    case 'image_mcq':
    case 'odd_one_out':
    case 'fill_blank':
      return response === question.answer

    case 'match':
      return (
        Array.isArray(question.pairs) &&
        question.pairs.length > 0 &&
        question.pairs.every((p) => response[p.left] === p.right)
      )

    case 'sequence':
      return (
        Array.isArray(response) &&
        Array.isArray(question.sequence) &&
        response.length === question.sequence.length &&
        response.every((item, i) => item === question.sequence[i])
      )

    default:
      return false
  }
}
