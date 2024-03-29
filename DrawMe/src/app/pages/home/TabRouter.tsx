import { useMemo, useState } from "react"

import styled from "styled-components"

import Home from "./Home"
import Image from "./Image"
import { ITabDescription, TabT } from "./types"

import Canvas from "@/components/Canvas"
import Navbar from "@/components/Navbar"
import Dithering from "@/pages/home/Dithering"
import Gamma from "@/pages/home/Gamma"
import Histogram from "@/pages/home/Histogram"
import Lines from "@/pages/home/Lines"
import Scaling from "@/pages/home/Scaling"
import Spaces from "@/pages/home/Spaces"
import ColorIcon from "~/assets/ColorIcon"
import GammaIcon from "~/assets/GammaIcon"
import GradientIcon from "~/assets/GradientIcon"
import HistogramIcon from "~/assets/HistogramIcon"
import ImageIcon from "~/assets/ImageIcon"
import LineIcon from "~/assets/LineIcon"
import ScaleIcon from "~/assets/ScaleIcon"

const tabs: ITabDescription[] = [
  {
    title: "Изображение",
    tab: "image",
    Icon: ImageIcon,
  },
  {
    title: "Пространства",
    tab: "spaces",
    Icon: ColorIcon,
  },
  {
    title: "Гамма",
    tab: "gamma",
    Icon: GammaIcon,
  },
  {
    title: "Линии",
    tab: "lines",
    Icon: LineIcon,
  },
  {
    title: "Дизеринг",
    tab: "dithering",
    Icon: GradientIcon,
  },
  {
    title: "Гистограмма",
    tab: "histogram",
    Icon: HistogramIcon,
  },
  {
    title: "Масштаб",
    tab: "scaling",
    Icon: ScaleIcon,
  },
]

export default function TabRouter() {
  const [tab, setTab] = useState<TabT>("home")

  const Tab = useMemo(() => {
    switch (tab) {
      case "image":
        return Image
      case "spaces":
        return Spaces
      case "gamma":
        return Gamma
      case "lines":
        return Lines
      case "dithering":
        return Dithering
      case "histogram":
        return Histogram
      case "scaling":
        return Scaling
      default:
        return Home
    }
  }, [tab])

  return (
    <Wrapper>
      {tab !== "home" && <Navbar tabs={tabs} current={tab} setTab={setTab} />}
      {tab !== "home" && tab !== "lines" && <Canvas />}
      <Tab setTab={setTab} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;

  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
`
