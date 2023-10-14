const RGBToYCoCg = (r: number, g: number, b: number): number[] => {
  const y: number = (r + 2 * g + b) / 4;
  const co: number = r - b;
  const cg: number = (-r + 2 * g - b) / 4;

  return [y, co, cg];
}

export default RGBToYCoCg;
