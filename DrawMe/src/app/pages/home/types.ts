export type TabT = "home" | "image" | "spaces" | "gamma"

export interface ITabDescription {
  title: string
  tab: TabT
  Icon: React.FC
}
