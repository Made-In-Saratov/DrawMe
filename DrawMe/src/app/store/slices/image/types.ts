export interface IImage {
  pixels: number[]
  width: number
  height: number
  maxColorValue: number
  isP6: boolean
}

export type SpacesT =
  | "RGB"
  | "HSL"
  | "HSV"
  | "YCbCr.601"
  | "YCbCr.709"
  | "YCoCg"
  | "CMY"

export interface IImageSlice {
  src: IImage | null

  space: SpacesT
  channels: [boolean, boolean, boolean]
  /*
   * a value of 0 defaults to sRGB gamma.
   */
  gamma: number
  convertedGamma: number
}
