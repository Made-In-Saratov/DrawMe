export default function bilinear({
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
  const newPixelsFinal = new Array(newHeight * newWidth * 3)
  let value: number

  const newPixelsHorizontal = new Array(height * newWidth * 3)
  const horizontalScales = new Array(newWidth)
  const verticalScales = new Array(newHeight)

  for (let col = 0; col < newWidth; col++) {
    console.log(`col: ${col}`)
    horizontalScales[col] = findKernelCoefs(
      ((col + 0.5 + offsetX * newWidth) / newWidth) * width,
      width
    )
  }

  for (let row = 0; row < newHeight; row++) {
    console.log(`row: ${row}`)
    verticalScales[row] = findKernelCoefs(
      ((row + 0.5 + offsetY * newHeight) / newHeight) * height,
      height
    )
  }

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < newWidth; col++) {
      const scalingCoefsHorizontal = horizontalScales[col]
      for (let color = 0; color < 3; color++) {
        value = 0
        for (
          let param = 0;
          param < scalingCoefsHorizontal.length / 2;
          param++
        ) {
          if (
            scalingCoefsHorizontal[param * 2] >= 0 &&
            scalingCoefsHorizontal[param * 2] <= width - 1
          ) {
            value +=
              scalingCoefsHorizontal[param * 2 + 1] *
              pixels[
                3 * (row * width + scalingCoefsHorizontal[param * 2]) + color
              ]
          }
        }
        newPixelsHorizontal[3 * (row * newWidth + col) + color] = value
      }
    }
  }

  for (let col = 0; col < newWidth; col++) {
    for (let row = 0; row < newHeight; row++) {
      const scalingCoefsVertical = verticalScales[row]
      for (let color = 0; color < 3; color++) {
        value = 0
        for (let param = 0; param < scalingCoefsVertical.length / 2; param++) {
          if (
            scalingCoefsVertical[param * 2] >= 0 &&
            scalingCoefsVertical[param * 2] <= height - 1
          ) {
            value +=
              scalingCoefsVertical[param * 2 + 1] *
              newPixelsHorizontal[
                3 * (scalingCoefsVertical[param * 2] * newWidth + col) + color
              ]
          }
        }
        newPixelsFinal[3 * (row * newWidth + col) + color] = value
      }
    }
  }

  return newPixelsFinal
}

function findKernelCoefs(center: number, oldDimension: number) {
  console.log(`center: ${center}`)
  const closest = Math.round(center)
  const result = new Array(6)
  if (closest < center) {
    result[0] = Math.max(Math.min(closest - 1, oldDimension - 1), 0)
    result[2] = Math.max(Math.min(closest, oldDimension - 1), 0)
    result[4] = Math.max(Math.min(closest + 1, oldDimension - 1), 0)
  } else {
    result[0] = Math.max(Math.min(closest - 2, oldDimension - 1), 0)
    result[2] = Math.max(Math.min(closest - 1, oldDimension - 1), 0)
    result[4] = Math.max(Math.min(closest, oldDimension - 1), 0)
  }

  result[1] = calcKernel(
    Math.max(Math.min(center, oldDimension), 0),
    result[0] + 0.5
  )
  result[3] = calcKernel(
    Math.max(Math.min(center, oldDimension), 0),
    result[2] + 0.5
  )
  result[5] = calcKernel(
    Math.max(Math.min(center, oldDimension), 0),
    result[4] + 0.5
  )

  console.log(result)

  const norma = result[1] + result[3] + result[5]
  result[1] /= norma
  result[3] /= norma
  result[5] /= norma

  return result
}

function calcKernel(kernelCenter: number, x: number) {
  if (Math.abs(x - kernelCenter) < 1) return 1 - Math.abs(x - kernelCenter)
  return 0
}
