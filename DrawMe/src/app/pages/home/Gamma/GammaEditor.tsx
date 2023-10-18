import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useState,
} from "react"

import styled from "styled-components"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Tooltip from "@/components/Tooltip"
import { text16 } from "@/utils/fonts"

interface IGammaEditorProps {
  title: string
  tooltip: React.ReactNode

  onClick?: (gamma: number) => void
}

export default function GammaEditor({
  title,
  tooltip,
  onClick = () => {},
}: IGammaEditorProps) {
  const [value, setValue] = useState("0")

  const handleInput = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target }) => setValue(target.value),
    []
  )

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    const gamma = Number(value)

    onClick(gamma)
  }, [onClick, value])

  const isButtonDisabled = !value || isNaN(Number(value)) || Number(value) < 0

  return (
    <Wrapper>
      <Tooltip>{tooltip}</Tooltip>

      <span>{title}</span>
      <Input
        value={value}
        onChange={handleInput}
        placeholder="Гамма..."
        type="number"
      />
      <Button
        data-type="primary"
        disabled={isButtonDisabled}
        onClick={handleClick}
      >
        Готово
      </Button>
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

  > ${Input} {
    width: 120px;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  > ${Button} {
    width: 84px;
  }
`
