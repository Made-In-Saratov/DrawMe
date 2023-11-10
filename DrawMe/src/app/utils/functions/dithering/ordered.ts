const ditheringMatrix = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]

export function ordered(
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
    const row = y % 8
    for (let x = 0; x < width; x++) {
      const col = x % 8

      const r = pixels[y * width * 3 + x * 3]
      const g = pixels[y * width * 3 + x * 3 + 1]
      const b = pixels[y * width * 3 + x * 3 + 2]

      const correction = (ditheringMatrix[row][col] * 4) / nColors

      const i1 = clamp((r + correction) / divider, 0, nColors)
      const i2 = clamp((g + correction) / divider, 0, nColors)
      const i3 = clamp((b + correction) / divider, 0, nColors)

      newPixels[y * width * 3 + x * 3] = gradient[i1]
      newPixels[y * width * 3 + x * 3 + 1] = gradient[i2]
      newPixels[y * width * 3 + x * 3 + 2] = gradient[i3]
    }
  }

  return newPixels
}

function clamp(value: number, min: number = 0, max: number = 255) {
  return value < min ? min : value > max ? max : Math.floor(value)
}
