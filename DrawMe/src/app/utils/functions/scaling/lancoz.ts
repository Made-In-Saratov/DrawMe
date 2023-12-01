export default function lancoz({
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

  for (let col = 0; col < newWidth; col++)
    horizontalScales[col] = findKernelCoefs(
      ((col + 0.5 + offsetX * newWidth) / newWidth) * width,
      width
    )

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
          newPixelsHorizontal[3 * (row * newWidth + col) + color] = clamp(value)
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
        newPixelsHorizontal[row * newWidth + col] = clamp(value)
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
          newPixelsFinal[3 * (row * newWidth + col) + color] = clamp(value)
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
        newPixelsFinal[row * newWidth + col] = clamp(value)
      }
    }
  }

  return newPixelsFinal
}

function findKernelCoefs(center: number, oldDimension: number) {
  const closest = Math.round(center)
  const result = new Array(14)
  if (closest < center) {
    result[0] = Math.max(Math.min(closest - 3, oldDimension - 1), 0)
    result[2] = Math.max(Math.min(closest - 2, oldDimension - 1), 0)
    result[4] = Math.max(Math.min(closest - 1, oldDimension - 1), 0)
    result[6] = Math.max(Math.min(closest, oldDimension - 1), 0)
    result[8] = Math.max(Math.min(closest + 1, oldDimension - 1), 0)
    result[10] = Math.max(Math.min(closest + 2, oldDimension - 1), 0)
    result[12] = Math.max(Math.min(closest + 3, oldDimension - 1), 0)
  } else {
    result[0] = Math.max(Math.min(closest - 4, oldDimension - 1), 0)
    result[2] = Math.max(Math.min(closest - 3, oldDimension - 1), 0)
    result[4] = Math.max(Math.min(closest - 2, oldDimension - 1), 0)
    result[6] = Math.max(Math.min(closest - 1, oldDimension - 1), 0)
    result[8] = Math.max(Math.min(closest, oldDimension - 1), 0)
    result[10] = Math.max(Math.min(closest + 1, oldDimension - 1), 0)
  }

  for (let i = 0; i < result.length; i += 2) {
    result[i + 1] = calcKernel(
      Math.max(Math.min(center, oldDimension), 0),
      result[i] + 0.5
    )
  }

  const norma = result.reduce((acc, curr, index) => {
    if (index % 2 === 1) return acc + curr
    return acc
  }, 0)
  for (let i = 1; i < result.length; i += 2) result[i] /= norma

  return result
}

function calcKernel(kernelCenter: number, x: number) {
  if (Math.abs(x - kernelCenter) < 3)
    return sinc(x - kernelCenter) * sinc((x - kernelCenter) / 3)
  return 0
}

function sinc(x: number) {
  if (x === 0) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

function clamp(value: number) {
  return Math.max(Math.min(value, 255), 0)
}
