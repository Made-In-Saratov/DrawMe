const HSVToRGB = (h: number, s: number, b: number): number[] => {
  const saturation = s / 100
  const brightness = b / 100
  const k = (n: number) => (n + h / 60) % 6
  const f = (n: number) =>
    brightness * (1 - saturation * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
  return [255 * f(5), 255 * f(3), 255 * f(1)]
}

export default HSVToRGB
