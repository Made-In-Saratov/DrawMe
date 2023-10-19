import { ISpace, SpacesT } from "@/pages/home/Spaces/types"
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

export const spaces: Record<SpacesT, ISpace> = {
  "RGB": {
    name: "RGB",
    channels: ["R", "G", "B"],
    converter: (rgb: number[]) => rgb,
    reverseConverter: (colorSpace: number[]) => colorSpace,
  },
  "HSL": {
    name: "HSL",
    channels: ["H", "S", "L"],
    converter: (rgb: number[]) => RGBToHSL(rgb[0], rgb[1], rgb[2]),
    reverseConverter: (colorSpace: number[]) =>
      HSLToRGB(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "HSV": {
    name: "HSV",
    channels: ["H", "S", "V"],
    converter: (rgb: number[]) => RGBToHSV(rgb[0], rgb[1], rgb[2]),
    reverseConverter: (colorSpace: number[]) =>
      HSVToRGB(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "YCbCr.601": {
    name: "YCbCr.601",
    channels: ["Y", "Cb", "Cr"],
    converter: (rgb: number[]) => YCbCr601ToRGB(rgb[0], rgb[1], rgb[2]),
    reverseConverter: (colorSpace: number[]) =>
      RGBToYCbCr601(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "YCbCr.709": {
    name: "YCbCr.709",
    channels: ["Y", "Cb", "Cr"],
    converter: (rgb: number[]) => YCbCr709ToRGB(rgb[0], rgb[1], rgb[2]),
    reverseConverter: (colorSpace: number[]) =>
      RGBToYCbCr709(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "YCoCg": {
    name: "YCoCg",
    channels: ["Y", "Co", "Cg"],
    converter: (rgb: number[]) => YCoCgToRGB(rgb[0], rgb[1], rgb[2]),
    reverseConverter: (colorSpace: number[]) =>
      RGBToYCoCg(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "CMY": {
    name: "CMY",
    channels: ["C", "M", "Y"],
    converter: (rgb: number[]) => RGBToCMY(rgb[0], rgb[1], rgb[2]),
    reverseConverter: (colorSpace: number[]) =>
      CMYToRGB(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
}
