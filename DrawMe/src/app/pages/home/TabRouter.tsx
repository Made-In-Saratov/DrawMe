import { useMemo, useState } from "react"

import styled from "styled-components"

import Home from "./Home"
import Image from "./Image"
import { TabT } from "./types"

import { IImage } from "@/utils/types/image"
import Spaces from "@/pages/spaces/Spaces"

export default function TabRouter() {
  const [tab, setTab] = useState<TabT>("home")

  const [image, setImage] = useState<IImage | null>(null)

  const Tab = useMemo(() => {
    switch (tab) {
      case "image":
        return Image
      case "spaces":
        return Spaces
      default:
        return Home
    }
  }, [tab])

  return (
    <Wrapper>
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
