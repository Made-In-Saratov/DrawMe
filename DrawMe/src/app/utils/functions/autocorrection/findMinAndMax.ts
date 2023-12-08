import correctBrightness from "./correctBrightness"

type AutocorrectionLimitsT = {
  min: number
  max: number
}

export default function findMinAndMax(
  pixelsLength: number,
  histogramData: number[],
  left: number,
  right: number
): AutocorrectionLimitsT {
  const amountOfIgnoredPixelsLeft = left * pixelsLength
  let yMin = 0
  let yMax = 255

  let tempSum = 0
  for (let i = 0; i < histogramData.length; i += 1) {
    tempSum += histogramData[i]
    if (tempSum >= amountOfIgnoredPixelsLeft) {
      yMin = i
      break
    }
  }

  const amountOfIgnoredPixelsRight = right * pixelsLength
  tempSum = 0
  for (let i = histogramData.length - 1; i > 0; i -= 1) {
    tempSum += histogramData[i]
    if (tempSum >= amountOfIgnoredPixelsRight) {
      yMax = i
      break
    }
  }

  return {
    min: yMin,
    max: yMax,
  }
}
