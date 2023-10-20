export default function YCbCr601ToRGB(y: number, cb: number, cr: number) {
  const r = y + 1.402 * (cr - 128)
  const g = y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128)
  const b = y + 1.772 * (cb - 128)

  return [r, g, b]
}
