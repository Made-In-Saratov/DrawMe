export default function nearestNeighbors({
  pixels,
  width,
  height,
  newWidth,
  newHeight,
}: {
  pixels: number[]
  width: number
  height: number
  newWidth: number
  newHeight: number
}) {
  const newPixels = new Array(newHeight * newWidth * 3)
  let position: number

  for (let row = 0; row < height; row++) {
    for (let i = 0; i < newWidth; i++) {
      position = Math.round((i / newWidth) * width)
      newPixels[row * newWidth * 3 + i * 3] =
        pixels[row * width * 3 + position * 3]
      newPixels[row * newWidth * 3 + i * 3 + 1] =
        pixels[row * width * 3 + position * 3 + 1]
      newPixels[row * newWidth * 3 + i * 3 + 2] =
        pixels[row * width * 3 + position * 3 + 2]
    }
  }

  for (let col = 0; col < width; col++) {
    for (let i = 0; i < newHeight; i++) {
      position = Math.round((i / newHeight) * height)
      newPixels[i * newWidth * 3 + col * 3] =
        (newPixels[i * newWidth * 3 + col * 3] +
          newPixels[position * newWidth * 3 + col * 3]) /
        2
      newPixels[i * newWidth * 3 + col * 3 + 1] =
        (newPixels[i * newWidth * 3 + col * 3 + 1] +
          newPixels[position * newWidth * 3 + col * 3 + 1]) /
        2
      newPixels[i * newWidth * 3 + col * 3 + 2] =
        (newPixels[i * newWidth * 3 + col * 3 + 2] +
          newPixels[position * newWidth * 3 + col * 3 + 2]) /
        2
    }
  }

  return newPixels
}
