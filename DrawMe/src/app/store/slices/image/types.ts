export type SpacesT =
  | "RGB"
  | "HSL"
  | "HSV"
  | "YCbCr.601"
  | "YCbCr.709"
  | "YCoCg"
  | "CMY"

export type IPoint = {
  x: number
  y: number
}

export interface IImage {
  pixels: number[]
  width: number
  height: number
  maxColorValue: number
  isP6: boolean
}

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
