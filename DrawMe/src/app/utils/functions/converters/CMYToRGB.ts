const CMYToRGB = (c: number, m: number, y: number): number[] => {
  const cyan = Math.min(1, Math.max(0, c))
  const magenta = Math.min(1, Math.max(0, m))
  const yellow = Math.min(1, Math.max(0, y))

  const r = (1 - cyan) * 255
  const g = (1 - magenta) * 255
  const b = (1 - yellow) * 255

  return [r, g, b]
}

export default CMYToRGB
