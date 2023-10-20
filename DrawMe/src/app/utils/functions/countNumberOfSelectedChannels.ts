export function countNumberOfSelectedChannels(channels: boolean[]) {
  return channels.reduce((sum: number, value: boolean) => sum + +value, 0)
}
