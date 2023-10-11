export interface Space {
  name: string;
  channels: string[];
}

export type Spaces = 'RGB' | 'HSL' | 'HSV' | 'YCbCr.601' | 'YCbCr.709' | 'YCoCg' | 'CMY';
