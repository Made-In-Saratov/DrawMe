const RGBToHSL = (r: number, g: number, b: number): number[] => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const l = Math.max(red, green, blue)
  const s = l - Math.min(red, green, blue)
  const h = s
    ? l === red
      ? (green - blue) / s
      : l === green
      ? 2 + (blue - red) / s
      : 4 + (red - green) / s
    : 0
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ]
}

export default RGBToHSL
