import RGBToHSL from "@/utils/functions/converters/RGBToHSL";
import HSLToRGB from "@/utils/functions/converters/HSLToRGB";

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
    "converter": (rgb: number[]) => rgb,
    "reverseConverter": (colorSpace: number[]) => colorSpace,
  },
  "YCbCr.601": {
    "name": "YCbCr.601",
    "channels": ["Y", "Cb", "Cr"],
    "converter": (rgb: number[]) => rgb,
    "reverseConverter": (colorSpace: number[]) => colorSpace,
  },
  "YCbCr.709": {
    "name": "YCbCr.709",
    "channels": ["Y", "Cb", "Cr"],
    "converter": (rgb: number[]) => rgb,
    "reverseConverter": (colorSpace: number[]) => colorSpace,
  },
  "YCoCg": {
    "name": "YCoCg",
    "channels": ["Y", "Co", "Cg"],
    "converter": (rgb: number[]) => rgb,
    "reverseConverter": (colorSpace: number[]) => colorSpace,
  },
  "CMY": {
    "name": "CMY",
    "channels": ["C", "M", "Y"],
    "converter": (rgb: number[]) => rgb,
    "reverseConverter": (colorSpace: number[]) => colorSpace,
  },
};

export interface Space {
  name: string;
  channels: string[];
  converter: (rgb: number[]) => number[];
  reverseConverter: (colorSpace: number[]) => number[];
}

export type Spaces = 'RGB' | 'HSL' | 'HSV' | 'YCbCr.601' | 'YCbCr.709' | 'YCoCg' | 'CMY';
