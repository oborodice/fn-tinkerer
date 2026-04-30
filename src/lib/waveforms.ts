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

export function samplePoints(
  fn: (x: number) => number,
  amplitude: number,
  frequency: number,
  phase: number,
  xMin = -10,
  xMax = 10,
  steps = 2000, // 一般的なディスプレイ幅は1920px程度。グラフ描画領域を800px想定すると1px1点以上になり十分滑らか
): [number, number][] {
  const step = (xMax - xMin) / steps
  const points: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step
    points.push([x, amplitude * fn(frequency * x + phase)])
  }
  return points
}
