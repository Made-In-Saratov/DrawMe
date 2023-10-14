const RGBToHSV = (r: number, g: number, b: number): number[] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v: number = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h: number =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

export default RGBToHSV;
