const YCbCr601ToRGB = (y: number, cb: number, cr: number): number[] => {
  const r = y + 1.402 * (cr - 128)
  const g = y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128)
  const b = y + 1.772 * (cb - 128)

  const clamp = (value: number) => Math.min(255, Math.max(0, value))

  return [clamp(r), clamp(g), clamp(b)]
}

export default YCbCr601ToRGB
