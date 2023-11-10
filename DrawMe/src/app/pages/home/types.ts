export type TabT = "home" | "image" | "spaces" | "gamma" | "dithering"

export interface ITabDescription {
  title: string
  tab: TabT
  Icon: React.FC
}
