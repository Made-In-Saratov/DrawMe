export default function RGBToHSL(r: number, g: number, b: number) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const m = Math.min(red, green, blue)
  const M = Math.max(red, green, blue)
  const c = M - m
  const l = (m + M) / 2
  const s = l === 0 || l === 1 ? 0 : c / (1 - Math.abs(2 * l - 1))
  const h = s
    ? M === red
      ? (green - blue) / c
      : M === green
      ? 2 + (blue - red) / c
      : 4 + (red - green) / c
    : 0
  return [60 * h < 0 ? 60 * h + 360 : 60 * h, s, l]
}
