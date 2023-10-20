import { SpacesT } from "@/store/slices/image/types"
import CMYToRGB from "@/utils/functions/converters/CMYToRGB"
import HSLToRGB from "@/utils/functions/converters/HSLToRGB"
import HSVToRGB from "@/utils/functions/converters/HSVToRGB"
import RGBToCMY from "@/utils/functions/converters/RGBToCMY"
import RGBToHSL from "@/utils/functions/converters/RGBToHSL"
import RGBToHSV from "@/utils/functions/converters/RGBToHSV"
import RGBToYCbCr601 from "@/utils/functions/converters/RGBToYCbCr601"
import RGBToYCbCr709 from "@/utils/functions/converters/RGBToYCbCr709"
import RGBToYCoCg from "@/utils/functions/converters/RGBToYCoCg"
import YCbCr601ToRGB from "@/utils/functions/converters/YCbCr601ToRGB"
import YCbCr709ToRGB from "@/utils/functions/converters/YCbCr709ToRGB"
import YCoCgToRGB from "@/utils/functions/converters/YCoCgToRGB"

export interface ISpaceDetails {
  name: string
  channels: string[]
  converter: (rgb: number[]) => number[]
  reverseConverter: (colorSpace: number[]) => number[]
}

function getConverter(
  converter: (channel1: number, channel2: number, channel3: number) => number[]
) {
  return (colorSpace: number[]) =>
    converter(colorSpace[0], colorSpace[1], colorSpace[2])
}

export const spaces: Record<SpacesT, ISpaceDetails> = {
  "RGB": {
    name: "RGB",
    channels: ["R", "G", "B"],
    converter: (rgb: number[]) => rgb,
    reverseConverter: (colorSpace: number[]) => colorSpace,
  },
  "HSL": {
    name: "HSL",
    channels: ["H", "S", "L"],
    converter: getConverter(RGBToHSL),
    reverseConverter: getConverter(HSLToRGB),
  },
  "HSV": {
    name: "HSV",
    channels: ["H", "S", "V"],
    converter: getConverter(RGBToHSV),
    reverseConverter: getConverter(HSVToRGB),
  },
  "YCbCr.601": {
    name: "YCbCr.601",
    channels: ["Y", "Cb", "Cr"],
    converter: getConverter(RGBToYCbCr601),
    reverseConverter: getConverter(YCbCr601ToRGB),
  },
  "YCbCr.709": {
    name: "YCbCr.709",
    channels: ["Y", "Cb", "Cr"],
    converter: getConverter(RGBToYCbCr709),
    reverseConverter: getConverter(YCbCr709ToRGB),
  },
  "YCoCg": {
    name: "YCoCg",
    channels: ["Y", "Co", "Cg"],
    converter: getConverter(RGBToYCoCg),
    reverseConverter: getConverter(YCoCgToRGB),
  },
  "CMY": {
    name: "CMY",
    channels: ["C", "M", "Y"],
    converter: getConverter(RGBToCMY),
    reverseConverter: getConverter(CMYToRGB),
  },
}
