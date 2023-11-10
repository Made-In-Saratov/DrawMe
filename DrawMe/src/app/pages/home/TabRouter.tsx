import { useMemo, useState } from "react"

import styled from "styled-components"

import Home from "./Home"
import Image from "./Image"
import { ITabDescription, TabT } from "./types"

import Canvas from "@/components/Canvas"
import Navbar from "@/components/Navbar"
import Dithering from "@/pages/home/Dithering"
import Gamma from "@/pages/home/Gamma"
import Lines from "@/pages/home/Lines"
import Spaces from "@/pages/home/Spaces"
import ColorIcon from "~/assets/ColorIcon"
import GammaIcon from "~/assets/GammaIcon"
import GradientIcon from "~/assets/GradientIcon"
import ImageIcon from "~/assets/ImageIcon"
import LineIcon from "~/assets/LineIcon"

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
