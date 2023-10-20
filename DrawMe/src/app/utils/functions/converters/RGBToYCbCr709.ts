export default function RGBToYCbCr709(r: number, g: number, b: number) {
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b
  const cb = -0.1146 * r - 0.3854 * g + 0.5 * b + 128
  const cr = 0.5 * r - 0.4542 * g - 0.0458 * b + 128

  return [y, cb, cr]
}
