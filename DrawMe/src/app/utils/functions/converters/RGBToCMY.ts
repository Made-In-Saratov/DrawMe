export default function RGBToCMY(r: number, g: number, b: number) {
  const red = Math.min(255, Math.max(0, r))
  const green = Math.min(255, Math.max(0, g))
  const blue = Math.min(255, Math.max(0, b))

  const c = (1 - red / 255) * 255
  const m = (1 - green / 255) * 255
  const y = (1 - blue / 255) * 255

  return [c, m, y]
}
