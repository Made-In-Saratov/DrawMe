import { MouseEventHandler, useCallback, useState } from "react"

import styled from "styled-components"

import { text14 } from "@/utils/fonts"
import InfoIcon from "~/assets/InfoIcon"

interface ITooltipProps {
  children: React.ReactNode
}

export default function Tooltip({ children }: ITooltipProps) {
  const [isShown, setIsShown] = useState(false)

  const handleMouseOver = useCallback<MouseEventHandler<HTMLDivElement>>(
    () => setIsShown(prev => !prev),
    []
  )

  return (
    <Wrapper onMouseOver={handleMouseOver} onMouseOut={handleMouseOver}>
      <InfoIcon />

      {isShown && <TooltipWrapper>{children}</TooltipWrapper>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;

  cursor: pointer;

  width: 16px;
  height: 16px;
`

const TooltipWrapper = styled.div`
  border-radius: 20px 20px 0px 20px;
  background: #ffffff;
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);

  position: absolute;
  right: 13px;
  bottom: 13px;

  width: 300px;
  box-sizing: border-box;
  padding: 10px 16px;

  ${text14};
  color: var(--dark-blue);
`
