export type SpacesT =
  | "RGB"
  | "HSL"
  | "HSV"
  | "YCbCr.601"
  | "YCbCr.709"
  | "YCoCg"
  | "CMY"

export interface ISpace {
  name: string
  channels: string[]
  converter: (rgb: number[]) => number[]
  reverseConverter: (colorSpace: number[]) => number[]
}
