import { ScalingAlgorithmT } from "@/pages/home/Scaling/types"
import BCSpline from "@/utils/functions/scaling/BCSpline"
import bilinear from "@/utils/functions/scaling/bilinear"
import lancoz from "@/utils/functions/scaling/lancoz"
import nearestNeighborsKernel from "@/utils/functions/scaling/nearestNeighbourKernel"
import nearestNeighbors from "@/utils/functions/scaling/nearestNeighbourKernel"

type ApplyFunctionT = ({
  pixels,
  width,
  height,
  newWidth,
  newHeight,
  offsetX,
  offsetY,
  args,
}: {
  pixels: number[]
  width: number
  height: number
  newWidth: number
  newHeight: number
  offsetX: number
  offsetY: number
  args?: Record<string, number>
}) => number[]

export interface IScalingAlgorithmDetails {
  name: string
  apply: ApplyFunctionT
}

export const scaling: Record<ScalingAlgorithmT, IScalingAlgorithmDetails> = {
  NearestNeighbor: {
    name: "Nearest Neighbor",
    apply: nearestNeighborsKernel,
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
