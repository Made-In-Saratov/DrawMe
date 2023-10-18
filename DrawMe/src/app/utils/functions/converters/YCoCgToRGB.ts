const YCoCgToRGB = (y: number, co: number, cg: number): number[] => {
  const r = y + co - cg
  const g = y + cg
  const b = y - co - cg

  return [r, g, b]
}

export default YCoCgToRGB
