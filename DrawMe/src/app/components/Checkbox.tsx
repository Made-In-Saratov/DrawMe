import { ChangeEventHandler } from "react"

import styled from "styled-components"

import Checkmark from "~/assets/Checkmark"

interface ICheckboxProps {
  checked: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
  disabled?: boolean
  value?: string
  className?: string
  children?: React.ReactNode
}

export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  value = "",
  className = "",
  children = null,
}: ICheckboxProps) {
  return (
    <Label className={className} data-disabled={disabled}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        value={value}
      />
      <CheckboxWrapper>
        <Checkmark />
      </CheckboxWrapper>
      {children}
    </Label>
  )
}

const Label = styled.label`
  > input {
    visibility: hidden;
    opacity: 0;
    position: absolute;
  }
`

const CheckboxWrapper = styled.span`
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid var(--magenta);
  background: linear-gradient(
      250deg,
      rgba(206, 65, 245, 0.07) 10%,
      rgba(104, 1, 239, 0.07) 90%
    ),
    #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  box-sizing: border-box;

  > svg {
    width: 16px;
    height: 16px;

    path {
      opacity: 0;
    }
  }

  input:checked + & {
    border: none;
    background: linear-gradient(
        250deg,
        var(--magenta) 10%,
        var(--light-blue) 90%
      ),
      #ffffff;

    > svg path {
      opacity: 1;
    }
  }
`
