const CMYToRGB = (c: number, m: number, y: number): number[] => {
  c = Math.min(1, Math.max(0, c));
  m = Math.min(1, Math.max(0, m));
  y = Math.min(1, Math.max(0, y));

  const r: number = (1 - c) * 255;
  const g: number = (1 - m) * 255;
  const b: number = (1 - y) * 255;

  return [r, g, b];
}

export default CMYToRGB;
