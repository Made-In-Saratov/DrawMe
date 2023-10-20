export default function RGBToYCbCr601(r: number, g: number, b: number) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b
  const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128
  const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128

  return [y, cb, cr]
}
