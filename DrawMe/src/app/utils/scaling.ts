import { ScalingAlgorithmT } from "@/pages/home/Scaling/types"
import BCSpline from "@/utils/functions/scaling/BCSpline"
import bilinear from "@/utils/functions/scaling/bilinear"
import lancoz from "@/utils/functions/scaling/lancoz"
import nearestNeighbors from "@/utils/functions/scaling/nearestNeighbors"

type ApplyFunctionT = ({
  pixels,
  width,
  height,
  newWidth,
  newHeight,
  args,
}: {
  pixels: number[]
  width: number
  height: number
  newWidth: number
  newHeight: number
  args?: Record<string, number>
}) => number[]

export interface IScalingAlgorithmDetails {
  name: string
  apply: ApplyFunctionT
}

export const scaling: Record<ScalingAlgorithmT, IScalingAlgorithmDetails> = {
  NearestNeighbor: {
    name: "Nearest Neighbor",
    apply: nearestNeighbors,
  },
  Bilinear: {
    name: "Bilinear",
    apply: bilinear,
  },
  Lancoz: {
    name: "Lancoz3",
    apply: lancoz,
  },
  BCSpline: {
    name: "BC-spline",
    apply: BCSpline,
  },
}
