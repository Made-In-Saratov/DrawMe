export function none(
  pixels: number[],
  width: number,
  height: number,
  bitsPerPixel: number
) {
  const newPixels = new Array<number>(pixels.length)
  const nColors = 2 ** bitsPerPixel - 1
  const divider = Math.floor(255 / nColors)
  const gradient = Array.from(
    { length: 2 ** bitsPerPixel - 1 },
    (_, i) => (i * 255) / (2 ** bitsPerPixel - 1)
  )
  gradient.push(255)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = pixels[y * width * 3 + x * 3]
      const g = pixels[y * width * 3 + x * 3 + 1]
      const b = pixels[y * width * 3 + x * 3 + 2]

      const i1 = clamp(r / divider, 0, nColors)
      const i2 = clamp(g / divider, 0, nColors)
      const i3 = clamp(b / divider, 0, nColors)

      newPixels[y * width * 3 + x * 3] = gradient[i1]
      newPixels[y * width * 3 + x * 3 + 1] = gradient[i2]
      newPixels[y * width * 3 + x * 3 + 2] = gradient[i3]
    }
  }

  return newPixels
}

function clamp(value: number, min: number = 0, max: number = 255) {
  return value < min ? min : value > max ? max : Math.round(value)
}
