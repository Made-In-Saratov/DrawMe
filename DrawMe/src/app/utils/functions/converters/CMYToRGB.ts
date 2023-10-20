export default function CMYToRGB(c: number, m: number, y: number) {
  const cyan = Math.min(1, Math.max(0, c / 255))
  const magenta = Math.min(1, Math.max(0, m / 255))
  const yellow = Math.min(1, Math.max(0, y / 255))

  const r = (1 - cyan) * 255
  const g = (1 - magenta) * 255
  const b = (1 - yellow) * 255

  return [r, g, b]
}
