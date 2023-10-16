import { useMemo, useState } from "react"

import styled from "styled-components"

import Home from "./Home"
import Image from "./Image"
import { ITabDescription, TabT } from "./types"

import Navbar from "@/components/Navbar"
import { IImage } from "@/utils/types/image"
import ColorIcon from "~/assets/ColorIcon"
import GammaIcon from "~/assets/GammaIcon"
import ImageIcon from "~/assets/ImageIcon"

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
]

export default function TabRounter() {
  const [tab, setTab] = useState<TabT>("home")

  const [image, setImage] = useState<IImage | null>(null)

  const Tab = useMemo(() => {
    switch (tab) {
      case "image":
        return Image
      default:
        return Home
    }
  }, [tab])

  return (
    <Wrapper>
      {tab !== "home" && <Navbar tabs={tabs} current={tab} setTab={setTab} />}

      <Tab image={image} setImage={setImage} setTab={setTab} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;

  height: 100vh;
  box-sizing: border-box;
  padding: 20px;
`
