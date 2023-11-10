import { DitheringAlgorithmT } from "@/pages/home/Dithering/types"
import { atkinson } from "@/utils/functions/dithering/atkinson"
import { floydSteinberg } from "@/utils/functions/dithering/floydSteinberg"
import { none } from "@/utils/functions/dithering/none"
import { ordered } from "@/utils/functions/dithering/ordered"
import { random } from "@/utils/functions/dithering/random"

type ApplyFunctionT = (
  pixels: number[],
  width: number,
  height: number,
  bitsPerPixel: number
) => number[]

export interface IDitheringAlgorithmDetails {
  name: string
  apply: ApplyFunctionT
}

export const dithering: Record<
  DitheringAlgorithmT,
  IDitheringAlgorithmDetails
> = {
  None: {
    name: "None",
    apply: none,
  },
  Ordered: {
    name: "Ordered (8x8)",
    apply: ordered,
  },
  Random: {
    name: "Random",
    apply: random,
  },
  FloydSteinberg: {
    name: "Floyd-Steinberg",
    apply: floydSteinberg,
  },
  Atkinson: {
    name: "Atkinson",
    apply: atkinson,
  },
}
