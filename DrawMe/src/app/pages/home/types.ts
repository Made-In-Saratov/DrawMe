export type TabT = "home" | "image" | "spaces" | "gamma" | "lines"

export interface ITabDescription {
  title: string
  tab: TabT
  Icon: React.FC
}
