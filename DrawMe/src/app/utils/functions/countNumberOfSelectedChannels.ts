export const countNumberOfSelectedChannels = (channels: boolean[]): number => {
  return channels.reduce((sum: number, value: boolean) => sum + +value, 0)
}
