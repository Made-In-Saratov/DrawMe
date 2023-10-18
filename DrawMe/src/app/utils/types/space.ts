import RGBToHSL from "@/utils/functions/converters/RGBToHSL";
import HSLToRGB from "@/utils/functions/converters/HSLToRGB";
import RGBToHSV from "@/utils/functions/converters/RGBToHSV";
import HSVToRGB from "@/utils/functions/converters/HSVToRGB";
import YCbCr601ToRGB from "@/utils/functions/converters/YCbCr601ToRGB";
import RGBToYCbCr601 from "@/utils/functions/converters/RGBToYCbCr601";
import YCbCr709ToRGB from "@/utils/functions/converters/YCbCr709ToRGB";
import YCoCgToRGB from "@/utils/functions/converters/YCoCgToRGB";
import RGBToYCoCg from "@/utils/functions/converters/RGBToYCoCg";
import RGBToCMY from "@/utils/functions/converters/RGBToCMY";
import CMYToRGB from "@/utils/functions/converters/CMYToRGB";

export const spaces: { [key in Spaces]: Space } = {
  "RGB": {
    "name": "RGB",
    "channels": ["R", "G", "B"],
    "converter": (rgb: number[]) => rgb,
    "reverseConverter": (colorSpace: number[]) => colorSpace,
  },
  "HSL": {
    "name": "HSL",
    "channels": ["H", "S", "L"],
    "converter": (rgb: number[]) => RGBToHSL(rgb[0], rgb[1], rgb[2]),
    "reverseConverter": (colorSpace: number[]) => HSLToRGB(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "HSV": {
    "name": "HSV",
    "channels": ["H", "S", "V"],
    "converter": (rgb: number[]) => RGBToHSV(rgb[0], rgb[1], rgb[2]),
    "reverseConverter": (colorSpace: number[]) => HSVToRGB(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "YCbCr.601": {
    "name": "YCbCr.601",
    "channels": ["Y", "Cb", "Cr"],
    "converter": (rgb: number[]) => YCbCr601ToRGB(rgb[0], rgb[1], rgb[2]),
    "reverseConverter": (colorSpace: number[]) => RGBToYCbCr601(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "YCbCr.709": {
    "name": "YCbCr.709",
    "channels": ["Y", "Cb", "Cr"],
    "converter": (rgb: number[]) => YCbCr709ToRGB(rgb[0], rgb[1], rgb[2]),
    "reverseConverter": (colorSpace: number[]) => RGBToYCbCr601(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "YCoCg": {
    "name": "YCoCg",
    "channels": ["Y", "Co", "Cg"],
    "converter": (rgb: number[]) => YCoCgToRGB(rgb[0], rgb[1], rgb[2]),
    "reverseConverter": (colorSpace: number[]) => RGBToYCoCg(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
  "CMY": {
    "name": "CMY",
    "channels": ["C", "M", "Y"],
    "converter": (rgb: number[]) => RGBToCMY(rgb[0], rgb[1], rgb[2]),
    "reverseConverter": (colorSpace: number[]) => CMYToRGB(colorSpace[0], colorSpace[1], colorSpace[2]),
  },
};

export interface Space {
  name: string;
  channels: string[];
  converter: (rgb: number[]) => number[];
  reverseConverter: (colorSpace: number[]) => number[];
}

export type Spaces = 'RGB' | 'HSL' | 'HSV' | 'YCbCr.601' | 'YCbCr.709' | 'YCoCg' | 'CMY';