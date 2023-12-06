export default function correctBrightness(
  value: number,
  min: number,
  max: number
): number {
  return ((value - min) * 255) / (max - min)
}
