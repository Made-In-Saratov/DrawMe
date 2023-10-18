const YCoCgToRGB = (y: number, co: number, cg: number): number[] => {
  const r = y + co - cg
  const g = y + cg
  const b = y - co - cg

  const clamp = (value: number) => Math.min(255, Math.max(0, value))

  return [clamp(r), clamp(g), clamp(b)]
}

export default YCoCgToRGB
