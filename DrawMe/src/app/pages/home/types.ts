export type TabT =
  | "home"
  | "image"
  | "spaces"
  | "gamma"
  | "lines"
  | "dithering"
  | "histogram"
  | "scaling"

export interface ITabDescription {
  title: string
  tab: TabT
  Icon: React.FC
}
