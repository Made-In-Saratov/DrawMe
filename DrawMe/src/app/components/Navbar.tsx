import { useCallback } from "react"

import styled from "styled-components"

import { ITabDescription, TabT } from "@/pages/home/types"
import { text14Medium } from "@/utils/fonts"

interface INavbarProps {
  tabs: ITabDescription[]
  current: TabT
  setTab: (tab: TabT) => void
}

export default function Navbar({ tabs, current, setTab }: INavbarProps) {
  const getClickHandler = useCallback(
    (tab: TabT) => () => setTab(tab),
    [setTab]
  )

  return (
    <Wrapper>
      {tabs.map(({ title, tab, Icon }) => (
        <Button
          key={tab}
          onClick={getClickHandler(tab)}
          data-selected={current === tab}
        >
          <Background />
          <Icon />
          {title}
        </Button>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);
  backdrop-filter: blur(16px);

  position: absolute;
  z-index: 100;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 300px;
  padding: 0 8px;
  gap: 8px;
`

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  opacity: 0;
  transition: opacity var(--transition-duration) var(--transition-function);

  background: linear-gradient(
    250deg,
    var(--magenta) 10%,
    var(--light-blue) 90%
  );
  border-radius: 8px;
`

const Button = styled.button`
  cursor: pointer;
  border: none;
  outline: none;

  border-radius: 8px;
  background: none;
  color: var(--dark-blue);
  ${text14Medium};

  display: flex;
  gap: 8px;
  padding: 4px;
  align-items: center;
  width: 100%;
  height: 32px;

  transition: color var(--transition-duration) var(--transition-function);

  position: relative;

  > svg {
    path {
      fill: var(--dark-blue);
      transition: fill var(--transition-duration) var(--transition-function);
    }

    // for icons with stroke
    path[stroke] {
      fill: none;
      stroke: var(--dark-blue);
      transition: stroke var(--transition-duration) var(--transition-function);
    }
  }

  &:hover {
    > ${Background} {
      opacity: 0.1;
    }
  }

  &[data-selected="true"] {
    color: #ffffff;

    > ${Background} {
      opacity: 1;
    }

    > svg {
      path {
        fill: #ffffff;
      }

      path[stroke] {
        fill: none;
        stroke: #ffffff;
      }
    }
  }
`
