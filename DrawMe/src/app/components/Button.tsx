import styled from "styled-components"

import { text16Medium } from "@/utils/fonts"

type ButtonType = "primary" | "secondary"

interface IButtonProps {
  "data-type"?: ButtonType
}

const Button = styled.button<IButtonProps>`
  cursor: pointer;
  border-radius: 20px;

  width: 210px;
  height: 40px;
  box-sizing: border-box;
  padding: 11px 10px 12px 10px;

  text-align: center;
  ${text16Medium};
  transition: transform var(--transition-duration) var(--transition-function);

  &[data-type="primary"] {
    border: none;
    background: linear-gradient(
      250deg,
      var(--magenta) 10%,
      var(--light-blue) 90%
    );

    color: #ffffff;

    &:hover {
      transform: scale(1.1);
    }
  }

  &[data-type="secondary"] {
    border: 1.5px solid var(--magenta);
    background: linear-gradient(
        250deg,
        rgba(206, 65, 245, 0.07) 10%,
        rgba(104, 1, 239, 0.07) 90%
      ),
      #ffffff;
    color: var(--dark-blue);
  }
`

export default Button
