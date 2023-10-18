const YCbCr709ToRGB = (y: number, cb: number, cr: number): number[] => {
  const r = y + 1.2803 * (cr - 128)
  const g = y - 0.2148 * (cb - 128) - 0.3806 * (cr - 128)
  const b = y + 2.1279 * (cb - 128)

  const clamp = (value: number) => Math.min(255, Math.max(0, value))

  return [clamp(r), clamp(g), clamp(b)]
}

export default YCbCr709ToRGB
