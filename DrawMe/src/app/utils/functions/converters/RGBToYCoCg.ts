const RGBToYCoCg = (r: number, g: number, b: number): number[] => {
  const y = (r + 2 * g + b) / 4
  const co = r - b
  const cg = (-r + 2 * g - b) / 4

  return [y, co, cg]
}

export default RGBToYCoCg
