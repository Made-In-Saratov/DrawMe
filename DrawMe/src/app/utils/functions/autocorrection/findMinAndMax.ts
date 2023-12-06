import correctBrightness from "./correctBrightness"

type AutocorrectionLimitsT = {
  min: number
  max: number
}

export default function findMinAndMax(
  pixelsLength: number,
  histogramData: number[],
  k: number
): AutocorrectionLimitsT {
  const amountOfIgnoredPixels = k * pixelsLength
  let yMin = 0
  let yMax = 255

  let tempSum = 0
  for (let i = 0; i < histogramData.length; i += 1) {
    tempSum += histogramData[i]
    if (tempSum >= amountOfIgnoredPixels) {
      yMin = i
      break
    }
  }

  tempSum = 0
  for (let i = histogramData.length - 1; i > 0; i -= 1) {
    tempSum += histogramData[i]
    if (tempSum >= amountOfIgnoredPixels) {
      yMax = i
      break
    }
  }

  return {
    min: yMin,
    max: yMax,
  }
}
