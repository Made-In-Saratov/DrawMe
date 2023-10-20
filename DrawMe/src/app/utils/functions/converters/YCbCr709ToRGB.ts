export default function YCbCr709ToRGB(y: number, cb: number, cr: number) {
  const r = y + 1.5748 * (cr - 128)
  const g = y - 0.1873 * (cb - 128) - 0.4681 * (cr - 128)
  const b = y + 1.8556 * (cb - 128)

  return [r, g, b]
}
