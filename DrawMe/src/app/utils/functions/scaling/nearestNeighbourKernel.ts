export default function nearestNeighborsKernel({
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
  const isP6 = pixels.length === width * height * 3

  const newPixelsFinal = new Array(newHeight * newWidth * 3)
  let value: number

  const newPixelsHorizontal = new Array(height * newWidth * 3)
  const horizontalScales = new Array(newWidth)
  const verticalScales = new Array(newHeight)

  for (let col = 0; col < newWidth; col++) {
    horizontalScales[col] = findKernelCoefs(
      ((col + 0.5 + offsetX * newWidth) / newWidth) * width,
      width
    )
    console.log(`col: ${col} | sc: ${horizontalScales[col][0]}`)
  }

  for (let row = 0; row < newHeight; row++)
    verticalScales[row] = findKernelCoefs(
      ((row + 0.5 + offsetY * newHeight) / newHeight) * height,
      height
    )

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < newWidth; col++) {
      const scalingCoefsHorizontal = horizontalScales[col]
      if (isP6)
        for (let color = 0; color < 3; color++) {
          value = 0
          for (
            let param = 0;
            param < scalingCoefsHorizontal.length / 2;
            param++
          )
            if (
              scalingCoefsHorizontal[param * 2] >= 0 &&
              scalingCoefsHorizontal[param * 2] <= width - 1
            )
              value +=
                scalingCoefsHorizontal[param * 2 + 1] *
                pixels[
                  3 * (row * width + scalingCoefsHorizontal[param * 2]) + color
                ]
          newPixelsHorizontal[3 * (row * newWidth + col) + color] = value
        }
      else {
        value = 0
        for (let param = 0; param < scalingCoefsHorizontal.length / 2; param++)
          if (
            scalingCoefsHorizontal[param * 2] >= 0 &&
            scalingCoefsHorizontal[param * 2] <= width - 1
          )
            value +=
              scalingCoefsHorizontal[param * 2 + 1] *
              pixels[row * width + scalingCoefsHorizontal[param * 2]]
        newPixelsHorizontal[row * newWidth + col] = value
      }
    }
  }

  for (let col = 0; col < newWidth; col++) {
    for (let row = 0; row < newHeight; row++) {
      const scalingCoefsVertical = verticalScales[row]
      if (isP6)
        for (let color = 0; color < 3; color++) {
          value = 0
          for (let param = 0; param < scalingCoefsVertical.length / 2; param++)
            if (
              scalingCoefsVertical[param * 2] >= 0 &&
              scalingCoefsVertical[param * 2] <= height - 1
            )
              value +=
                scalingCoefsVertical[param * 2 + 1] *
                newPixelsHorizontal[
                  3 * (scalingCoefsVertical[param * 2] * newWidth + col) + color
                ]
          newPixelsFinal[3 * (row * newWidth + col) + color] = value
        }
      else {
        value = 0
        for (let param = 0; param < scalingCoefsVertical.length / 2; param++)
          if (
            scalingCoefsVertical[param * 2] >= 0 &&
            scalingCoefsVertical[param * 2] <= height - 1
          )
            value +=
              scalingCoefsVertical[param * 2 + 1] *
              newPixelsHorizontal[
                scalingCoefsVertical[param * 2] * newWidth + col
              ]
        newPixelsFinal[row * newWidth + col] = value
      }
    }
  }

  return newPixelsFinal
}

function findKernelCoefs(center: number, oldDimension: number) {
  const result = new Array(2)
  result[0] = Math.max(Math.min(Math.floor(center), oldDimension - 1), 0)
  result[1] = calcKernel(
    Math.max(Math.min(center, oldDimension), 0),
    Math.max(Math.min(result[0] + 0.5, oldDimension), 0)
  )

  return result
}

function calcKernel(kernelCenter: number, x: number) {
  console.log(`center: ${kernelCenter} | x: ${x}`)
  if (Math.abs(x - kernelCenter) <= 0.5) return 1
  return 0
}
