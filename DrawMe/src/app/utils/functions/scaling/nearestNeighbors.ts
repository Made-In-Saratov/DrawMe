export default function nearestNeighbors({
  pixels,
  width,
  height,
  newWidth,
  newHeight,
  offsetX,
  offsetY,
}: {
  pixels: number[]
  width: number
  height: number
  newWidth: number
  newHeight: number
  offsetX: number
  offsetY: number
}) {
  const newPixels = new Array(newHeight * newWidth * 3)
  let positionHorizontal, positionVertical: number

  for (let row = 0; row < newHeight; row++) {
    for (let col = 0; col < newWidth; col++) {
      positionHorizontal = Math.round(
        ((col + 0.5) / newWidth + offsetX) * width - (0.5 * width) / newWidth
      )
      if (positionHorizontal < 0) positionHorizontal = 0
      else if (positionHorizontal > width - 1) positionHorizontal = width - 1
      else positionHorizontal = Math.round(positionHorizontal)

      positionVertical =
        ((row + 0.5) / newHeight + offsetY) * height -
        (0.5 * height) / newHeight
      if (positionVertical < 0) positionVertical = 0
      else if (positionVertical > height - 1) positionVertical = height - 1
      else positionVertical = Math.round(positionVertical)

      for (let color = 0; color < 3; color++) {
        newPixels[3 * (row * newWidth + col) + color] =
          pixels[3 * (positionVertical * width + positionHorizontal) + color]
      }
    }
  }

  return newPixels
}
