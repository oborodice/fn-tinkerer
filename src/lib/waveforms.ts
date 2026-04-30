type Waveform = {
  fn: (x: number) => number
  expr: string
  tonal: boolean
}

export const waveforms: Record<string, Waveform> = {
  sin: { fn: Math.sin, expr: 'sin(x)', tonal: true },
  cos: { fn: Math.cos, expr: 'cos(x)', tonal: true },
  tan: { fn: Math.tan, expr: 'tan(x)', tonal: false },
  square: { fn: (x) => Math.sign(Math.sin(x)), expr: 'sgn(sin(x))', tonal: true },
}

export function sampleSegments(
  fn: (x: number) => number,
  amplitude: number,
  frequency: number,
  phase: number,
  xMin = -10,
  xMax = 10,
  steps = 2000, // 一般的なディスプレイ幅は1920px程度。グラフ描画領域を800px想定すると1px1点以上になり十分滑らか
): [number, number][][] {
  const step = (xMax - xMin) / steps
  const discontinuityThreshold = 5 // yAxisの描画範囲[-2,2]を大きく超えた符号反転を漸近線とみなす
  const segments: [number, number][][] = [[]]
  let prevY = NaN
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step
    const y = amplitude * fn(frequency * x + phase)
    if ((prevY > discontinuityThreshold && y < -discontinuityThreshold) || (prevY < -discontinuityThreshold && y > discontinuityThreshold)) {
      segments.push([])
    }
    segments[segments.length - 1].push([x, y])
    prevY = y
  }
  return segments.filter(s => s.length > 0)
}
