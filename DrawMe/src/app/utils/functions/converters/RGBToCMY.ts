const RGBToCMY = (r: number, g: number, b: number): number[] => {
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  const c: number = 1 - r / 255;
  const m: number = 1 - g / 255;
  const y: number = 1 - b / 255;

  return [c, m, y]
}

export default RGBToCMY;
