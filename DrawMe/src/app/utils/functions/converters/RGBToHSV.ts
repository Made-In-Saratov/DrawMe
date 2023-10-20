export default function RGBToHSV(r: number, g: number, b: number) {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const v = Math.max(red, green, blue)
  const n = v - Math.min(red, green, blue)
  const h =
    n === 0
      ? 0
      : n && v === red
      ? (green - blue) / n
      : v === green
      ? 2 + (blue - red) / n
      : 4 + (red - green) / n
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 255, v * 255]
}
