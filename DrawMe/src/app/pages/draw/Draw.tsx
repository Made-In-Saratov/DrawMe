import { MouseEventHandler, useCallback, useRef } from "react"

import styled from "styled-components"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"

export default function Draw() {
  const input = useRef<HTMLInputElement>(null)

  const handleUploadClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    () => input.current?.click(),
    [input]
  )

  return (
    <Wrapper>
      {/* <Canvas image={img}></Canvas> */}
      <ButtonWrapper>
        <InputButton data-type="secondary" onClick={handleUploadClick}>
          Загрузить другое
          <input type="file" ref={input} />
        </InputButton>
        <Button data-type="primary">Скачать изображение</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div``

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 24px;
  padding: 20px 24px;

  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);
  backdrop-filter: blur(8px);
`

const InputButton = styled(Button)`
  > input {
    display: none;
  }
`
