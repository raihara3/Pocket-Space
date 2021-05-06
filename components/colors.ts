/* Color palette */

const colors = {
  white01: '#ffffff',
  white02: '#f1f1f1',
  gray01: '#5f5f5f',
  black01: '#323232',
  black02: '#424242',
  red01: '#d32f2f',
} as const

export default colors

export type Colors = typeof colors[keyof typeof colors]
