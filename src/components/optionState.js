// Works out how a single tappable option should look.
// While answering: the tapped option is 'selected', others 'idle'.
// During feedback: the right answer is 'correct', a wrong pick is 'wrong',
// everything else is 'muted'.
export function optionState(option, { phase, response, answer }) {
  if (phase !== 'feedback') {
    return response === option ? 'selected' : 'idle'
  }
  if (option === answer) return 'correct'
  if (option === response) return 'wrong'
  return 'muted'
}
