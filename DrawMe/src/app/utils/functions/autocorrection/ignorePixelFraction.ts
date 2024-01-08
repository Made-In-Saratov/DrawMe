import correctBrightness from "./correctBrightness"

export default function ignorePixelFraction(
  pixels: number[],
  yMin: number,
  yMax: number,
  isY: boolean = false
): number[] {
  const newPixels = Array.from(pixels)

  for (let i = 0; i < pixels.length; i += isY ? 3 : 1) {
    if (pixels[i] < yMin) newPixels[i] = 0
    else if (pixels[i] > yMax) newPixels[i] = 255
    else newPixels[i] = correctBrightness(pixels[i], yMin, yMax)
  }

  return newPixels
}
