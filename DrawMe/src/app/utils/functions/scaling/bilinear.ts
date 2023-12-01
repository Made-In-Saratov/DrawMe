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
  const newPixels = new Array(newHeight * newWidth * 3)
  let value, norma: number

  // for (let row = 0; row < newHeight; row++) {
  //   const scalingCoefsVertical = findKernelCoefs(
  //     ((row + 0.5) / newHeight) * height,
  //     height
  //   )
  //   for (let col = 0; col < newWidth; col++) {
  //     const scalingCoefsHorizontal = findKernelCoefs(
  //       ((col + 0.5) / newWidth) * width,
  //       width
  //     )
  //     for (let color = 0; color < 3; color++) {
  //       value = 0
  //       norma = 0
  //       for (
  //         let param1 = 0;
  //         param1 < scalingCoefsHorizontal.length / 2;
  //         param1++
  //       ) {
  //         if (
  //           scalingCoefsHorizontal[param1 * 2] >= 0 &&
  //           scalingCoefsHorizontal[param1 * 2] <= width - 1
  //         ) {
  //           for (
  //             let param2 = 0;
  //             param2 < scalingCoefsVertical.length / 2;
  //             param2++
  //           ) {
  //             if (
  //               scalingCoefsVertical[param2 * 2] >= 0 &&
  //               scalingCoefsVertical[param2 * 2] <= height - 1
  //             ) {
  //               value +=
  //                 (scalingCoefsHorizontal[param1 * 2 + 1] +
  //                   scalingCoefsVertical[param2 * 2 + 1]) *
  //                 pixels[
  //                   3 *
  //                     (scalingCoefsVertical[param2 * 2] * width +
  //                       scalingCoefsHorizontal[param1 * 2]) +
  //                     color
  //                 ]
  //               norma +=
  //                 scalingCoefsHorizontal[param1 * 2 + 1] +
  //                 scalingCoefsVertical[param2 * 2 + 1]
  //             }
  //           }
  //         }
  //       }
  //       // for (let param = 0; param < scalingCoefsVertical.length / 2; param++) {
  //       //   if (
  //       //     scalingCoefsVertical[param * 2] >= 0 &&
  //       //     scalingCoefsVertical[param * 2] <= height - 1
  //       //   ) {
  //       //     value +=
  //       //       scalingCoefsVertical[param * 2 + 1] *
  //       //       pixels[
  //       //         3 *
  //       //           (scalingCoefsVertical[param * 2] * width +
  //       //             scalingCoefsHorizontal[param * 2]) +
  //       //           color
  //       //       ]
  //       //   }
  //       // }
  //       newPixels[3 * (row * newWidth + col) + color] = value / norma
  //     }
  //   }
  // }

  const newPixelsHorizontal = new Array(height * newWidth * 3)
  const newPixelsFinal = new Array(newHeight * newWidth * 3)

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < newWidth; col++) {
      const scalingCoefsHorizontal = findKernelCoefs(
        ((col + 0.5) / newWidth) * width,
        width
      )
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
      const scalingCoefsVertical = findKernelCoefs(
        ((row + 0.5) / newHeight) * height,
        height
      )
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
  const closest = Math.round(center)
  const result = new Array(6)
  if (closest < center) {
    result[0] = closest - 1
    result[2] = closest
    result[4] = closest + 1
  } else {
    result[0] = closest - 2
    result[2] = closest - 1
    result[4] = closest
  }

  result[1] =
    result[0] >= 0 && result[0] <= oldDimension - 1
      ? calcKernel(center, result[0] + 0.5)
      : 0
  result[3] =
    result[2] >= 0 && result[2] <= oldDimension - 1
      ? calcKernel(center, result[2] + 0.5)
      : 0
  result[5] =
    result[4] >= 0 && result[4] <= oldDimension - 1
      ? calcKernel(center, result[4] + 0.5)
      : 0

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
