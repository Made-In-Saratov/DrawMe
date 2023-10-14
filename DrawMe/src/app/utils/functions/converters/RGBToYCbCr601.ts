const RGBToYCbCr601 = (r: number, g: number, b: number): number[] => {
  const y: number = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb: number = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
  const cr: number = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;

  const clamp = (value: number) => Math.min(255, Math.max(0, value));

  return [clamp(y), clamp(cb), clamp(cr)];
}

export default RGBToYCbCr601;
