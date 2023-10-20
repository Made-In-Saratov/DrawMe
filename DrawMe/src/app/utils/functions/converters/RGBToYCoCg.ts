export default function RGBToYCoCg(r: number, g: number, b: number) {
  const y = (r + 2 * g + b) / 4
  const co = (r - b) / 2
  const cg = (-r + 2 * g - b) / 4

  return [y, co, cg]
}
