import styled from "styled-components"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Tooltip from "@/components/Tooltip"
import { text16 } from "@/utils/fonts"

interface IGammaEditorProps {
  title: string
  tooltip: React.ReactNode
}

export default function GammaEditor({ title, tooltip }: IGammaEditorProps) {
  return (
    <Wrapper>
      <Tooltip>{tooltip}</Tooltip>

      <span>{title}</span>
      <Input placeholder="Введите гамму..." />
      <Button data-type="primary">Готово</Button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;

  > div:first-child {
    margin-right: auto;
  }

  > span {
    ${text16};
    color: var(--dark-blue);
  }

  > ${Button} {
    width: 84px;
  }
`
