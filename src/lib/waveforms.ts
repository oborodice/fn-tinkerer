type Waveform = {
  fn: (x: number) => number
  expr: string
}

export const waveforms: Record<string, Waveform> = {
  sin: { fn: Math.sin, expr: 'sin(x)' },
  cos: { fn: Math.cos, expr: 'cos(x)' },
  tan: { fn: Math.tan, expr: 'tan(x)' },
}
