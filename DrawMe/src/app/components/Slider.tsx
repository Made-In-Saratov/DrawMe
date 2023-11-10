import { ChangeEventHandler, useCallback, useEffect, useRef } from "react"

import styled from "styled-components"

interface ISliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
}: ISliderProps) {
  const slider = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const percent = ((value - min) / (max - min)) * 100
    slider.current!.style.background = `linear-gradient(to right, var(--magenta) 0%, var(--light-blue) ${percent}%, var(--white) ${percent}%, var(--white) 100%)`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value } }) => onChange(Number(value)),
    [onChange]
  )

  return (
    <Input
      ref={slider}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
    />
  )
}

const Input = styled.input`
  appearance: none;
  margin: 0;
  outline: none;

  box-sizing: border-box;
  height: 10px;
  width: 160px;

  border-radius: 5px;

  // TODO: add Firefox support
  &::-webkit-slider-thumb {
    appearance: none;

    cursor: grab;
    border: 1.5px solid var(--magenta);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  &:active::-webkit-slider-thumb {
    cursor: grabbing;
  }
`
