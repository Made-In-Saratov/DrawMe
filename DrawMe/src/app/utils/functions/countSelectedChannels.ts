export function countSelectedChannels(channels: [boolean, boolean, boolean]) {
  return channels.reduce((sum: number, value: boolean) => sum + +value, 0)
}
