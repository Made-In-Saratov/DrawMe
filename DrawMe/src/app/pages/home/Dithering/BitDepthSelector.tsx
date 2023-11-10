import styled from "styled-components"

import Slider from "@/components/Slider"
import { text16 } from "@/utils/fonts"

interface IBitDepthSelectorProps {
  value: number
  onChange: (value: number) => void
}

export default function BitDepthSelector({
  value,
  onChange,
}: IBitDepthSelectorProps) {
  return (
    <Wrapper>
      Битность
      <Slider min={1} max={8} value={value} onChange={onChange} />
      {value}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 260px;

  ${text16};
`
