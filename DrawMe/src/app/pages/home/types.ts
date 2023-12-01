export type TabT =
  | "home"
  | "image"
  | "spaces"
  | "gamma"
  | "lines"
  | "dithering"
  | "scaling"

export interface ITabDescription {
  title: string
  tab: TabT
  Icon: React.FC
}
