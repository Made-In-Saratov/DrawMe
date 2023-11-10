import {
  HTMLAttributes,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { Transition } from "react-transition-group"
import styled from "styled-components"

import { text16Medium } from "@/utils/fonts"
import DropdownIcon from "~/assets/DropdownIcon"

interface IDropdownProps extends HTMLAttributes<HTMLDivElement> {
  items: string[]
  activeItem: string
  setActiveItem: (item: string) => void
  className?: string
}

export default function Dropdown({
  items,
  activeItem,
  setActiveItem,
  ...props
}: IDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const listener = () => setIsOpen(false)
      document.addEventListener("click", listener)

      return () => document.removeEventListener("click", listener)
    }
  }, [isOpen])

  const toggleOpen: MouseEventHandler<HTMLDivElement> = useCallback(event => {
    event.stopPropagation()

    setIsOpen(open => !open)
  }, [])

  const handleItemClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    ({ currentTarget }) => {
      const item = currentTarget.dataset.item
      if (item) setActiveItem(item)
    },
    [setActiveItem]
  )

  return (
    <Wrapper {...props}>
      <TitleWrapper onClick={toggleOpen}>
        <DropdownIcon />
        <span>{activeItem}</span>
      </TitleWrapper>

      <Transition in={isOpen} timeout={250} nodeRef={wrapper}>
        {state => (
          <ListWrapper data-open={state} ref={wrapper}>
            {items.map(item => (
              <DropdownItem
                key={item}
                data-item={item}
                data-active={item === activeItem}
                onClick={handleItemClick}
              >
                <DropdownIcon />
                {item}
              </DropdownItem>
            ))}
          </ListWrapper>
        )}
      </Transition>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  width: 140px;
`

const TitleWrapper = styled.div`
  border-radius: 20px;
  border: 1.5px solid var(--magenta);
  background: linear-gradient(
      250deg,
      rgba(206, 65, 245, 0.07) 10%,
      rgba(104, 1, 239, 0.07) 90%
    ),
    #ffffff;

  display: flex;
  width: 100%;
  height: 40px;
  padding: 0px 12px;
  align-items: center;
  box-sizing: border-box;
  gap: 4px;

  ${text16Medium};
`

const ListWrapper = styled.div`
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);

  position: absolute;
  z-index: 500;
  bottom: 0;

  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 8px 16px 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;

  &[data-open="entering"] {
    animation: dropdownOpen 0.25s var(--transition-function);
  }

  &[data-open="entered"] {
    opacity: 1;
  }

  &[data-open="exiting"] {
    animation: dropdownOpen 0.25s var(--transition-function) reverse;
  }

  &[data-open="exited"] {
    display: none;
  }

  @keyframes dropdownOpen {
    from {
      opacity: 0;
      pointer-events: none;
    }

    to {
      opacity: 1;
      pointer-events: all;
    }
  }
`

const DropdownItem = styled.button`
  cursor: pointer;
  border: none;
  background-color: transparent;
  outline: none;

  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 8px;

  ${text16Medium};

  > svg {
    transform: rotate(-90deg);
    opacity: 0;
    transition: opacity var(--transition-duration) var(--transition-function);

    path {
      transition: fill var(--transition-duration) var(--transition-function);
    }
  }

  &:hover {
    > svg {
      opacity: 1;
    }
  }

  &[data-active="true"] {
    color: var(--light-blue);

    > svg {
      opacity: 1;

      path {
        fill: var(--light-blue);
      }
    }
  }
`
