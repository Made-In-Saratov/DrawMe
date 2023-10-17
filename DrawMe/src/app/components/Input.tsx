import styled from "styled-components"

import { text16 } from "@/utils/fonts"

const Input = styled.input`
  outline: none;
  border-radius: 10px;
  border: 1.5px solid var(--magenta);
  background: linear-gradient(
      270deg,
      rgba(206, 65, 245, 0.07) 10%,
      rgba(104, 1, 239, 0.07) 90%
    ),
    #ffffff;

  height: 40px;
  padding: 0px 12px;
  box-sizing: border-box;

  ${text16};
  color: var(--dark-blue);

  &::placeholder {
    opacity: 0.5;
    color: var(--dark-blue);
  }
`

export default Input
