import correctBrightness from "./correctBrightness"

export default function ignorePixelFraction(
  pixels: number[],
  yMin: number,
  yMax: number,
  isY: boolean
): number[] {
  const newPixels = Array.from(pixels)
  if (isY) {
    for (let i = 0; i < pixels.length; i += 3) {
      if (pixels[i] < yMin) {
        newPixels[i] = 0
      } else if (pixels[i] > yMax) {
        newPixels[i] = 255
      } else {
        newPixels[i] = correctBrightness(pixels[i], yMin, yMax)
      }
    }
  } else {
    for (let i = 0; i < pixels.length; i += 1) {
      if (pixels[i] < yMin) {
        newPixels[i] = 0
      } else if (pixels[i] > yMax) {
        newPixels[i] = 255
      } else {
        newPixels[i] = correctBrightness(pixels[i], yMin, yMax)
      }
    }
  }

  console.log("min: ", yMin, "max: ", yMax)
  return newPixels
}
