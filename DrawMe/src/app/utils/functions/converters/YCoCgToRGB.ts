export default function YCoCgToRGB(y: number, co: number, cg: number) {
  const r = y + co - cg
  const g = y + cg
  const b = y - co - cg

  return [r, g, b]
}
