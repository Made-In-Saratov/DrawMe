import styled from "styled-components"

import Button from "@/components/Button"
import { header48, text16 } from "@/utils/fonts"

export default function Home() {
  return (
    <Wrapper>
      <h1>Draw Me</h1>
      <p>Лучший редактор изображений для спортивного программирования.</p>
      <Button data-type="primary">Загрузить файл</Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  position: absolute;
  top: 50%;
  transform: translate(0, -50%);

  > h1 {
    margin: 0 0 20px 0;
    ${header48};
    text-transform: uppercase;
  }

  > p {
    margin: 0 0 32px 0;
    ${text16};
  }
`
