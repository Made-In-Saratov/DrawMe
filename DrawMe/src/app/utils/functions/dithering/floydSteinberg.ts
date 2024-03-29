export function floydSteinberg(
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

  const errorsR = new Array<number>(width * height).fill(0)
  const errorsG = new Array<number>(width * height).fill(0)
  const errorsB = new Array<number>(width * height).fill(0)

  let i = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++, i++) {
      const r = pixels[y * width * 3 + x * 3]
      const g = pixels[y * width * 3 + x * 3 + 1]
      const b = pixels[y * width * 3 + x * 3 + 2]

      const i1 = clamp((r + errorsR[i]) / divider, 0, nColors)
      const i2 = clamp((g + errorsG[i]) / divider, 0, nColors)
      const i3 = clamp((b + errorsB[i]) / divider, 0, nColors)

      newPixels[y * width * 3 + x * 3] = gradient[i1]
      newPixels[y * width * 3 + x * 3 + 1] = gradient[i2]
      newPixels[y * width * 3 + x * 3 + 2] = gradient[i3]

      const errorR = r + errorsR[i] - gradient[i1]
      const errorG = g + errorsG[i] - gradient[i2]
      const errorB = b + errorsB[i] - gradient[i3]

      let index = i + 1
      if (x + 1 < width) {
        errorsR[index] += (errorR * 7) / 16
        errorsG[index] += (errorG * 7) / 16
        errorsB[index] += (errorB * 7) / 16
      }
      index += width - 2
      if (x - 1 >= 0 && y + 1 < height) {
        errorsR[index] += (errorR * 3) / 16
        errorsG[index] += (errorG * 3) / 16
        errorsB[index] += (errorB * 3) / 16
      }
      index++
      if (y + 1 < height) {
        errorsR[index] += (errorR * 5) / 16
        errorsG[index] += (errorG * 5) / 16
        errorsB[index] += (errorB * 5) / 16
      }
      index++
      if (x + 1 < width && y + 1 < height) {
        errorsR[index] += errorR / 16
        errorsG[index] += errorG / 16
        errorsB[index] += errorB / 16
      }
    }
  }

  return newPixels
}

function clamp(value: number, min: number = 0, max: number = 255) {
  return value < min ? min : value > max ? max : Math.round(value)
}
