const RGBToYCbCr709 = (r: number, g: number, b: number): number[] => {
  const y: number = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const cb: number = -0.1145 * r - 0.3855 * g + 0.5 * b + 128;
  const cr: number = 0.5 * r - 0.4542 * g - 0.0458 * b + 128;

  const clamp = (value: number) => Math.min(255, Math.max(0, value));

  return [clamp(y), clamp(cb), clamp(cr)];
}

export default RGBToYCbCr709;
