export default function BCSpline({
  pixels,
  width,
  height,
  newWidth,
  newHeight,
  args = { B: 0, C: 0 },
}: {
  pixels: number[]
  width: number
  height: number
  newWidth: number
  newHeight: number
  args?: Record<string, number>
}) {
  const { B, C } = args

  return pixels
}
