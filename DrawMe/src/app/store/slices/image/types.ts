export interface IImage {
  pixels: number[]
  width: number
  height: number
  maxColorValue: number
  isP6: boolean
}

export interface IImageSlice {
  src: IImage | null
  /*
   * a value of 0 defaults to sRGB gamma.
   */
  gamma: number
}
