export const convertInputToCertainty = (input, rigor) => {
  const rigority = -Math.log(rigor)
  const fooB = -input * rigority
  const fooA = Math.exp(fooB)
  const certainty = 1 - fooA
  return certainty.toPrecision(4)
}
