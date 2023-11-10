export function generateGradient(width: number, height: number) {
  const pixels = []
  const gradient = Array.from(
    { length: width - 1 },
    (_, i) => (i * 255) / (width - 1)
  )
  gradient.push(255)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      pixels.push(gradient[x], gradient[x], gradient[x])
    }
  }

  return pixels
}
