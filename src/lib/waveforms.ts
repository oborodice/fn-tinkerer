type Waveform = {
  fn: (x: number) => number
  expr: string
  tonal: boolean
}

export const waveforms: Record<string, Waveform> = {
  sin: { fn: Math.sin, expr: 'sin(x)', tonal: true },
  cos: { fn: Math.cos, expr: 'cos(x)', tonal: true },
  tan: { fn: Math.tan, expr: 'tan(x)', tonal: false },
}
