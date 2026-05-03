const frac = (x: number) => x - Math.floor(x)

type Waveform = {
  name: string
  fn: (x: number) => number
  expr: string
  tonal: boolean
}

export const waveforms: Record<string, Waveform> = {
  sin: { name: 'sin', fn: Math.sin, expr: 'sin(x)', tonal: true },
  cos: { name: 'cos', fn: Math.cos, expr: 'cos(x)', tonal: true },
  tan: { name: 'tan', fn: Math.tan, expr: 'tan(x)', tonal: false },
  square: { name: 'square', fn: (x) => Math.sign(Math.sin(x)), expr: 'sgn(sin(x))', tonal: true },
  sawtooth: { name: 'sawtooth', fn: (x) => 2 * frac(x / (2 * Math.PI)) - 1, expr: '2 * frac(x / 2π) - 1', tonal: true },
  triangle: { name: 'triangle', fn: (x) => 2 * Math.abs(2 * frac(x / (2 * Math.PI)) - 1) - 1, expr: '2 * |2 * frac(x / 2π) - 1| - 1', tonal: true },
  absSin: { name: 'rectified sin', fn: (x) => Math.abs(Math.sin(x)), expr: '|sin(x)|', tonal: true },
  sinc: { name: 'sinc', fn: (x) => x === 0 ? 1 : Math.sin(x) / x, expr: 'sin(x) / x', tonal: false },
  sinc2: { name: 'sinc²', fn: (x) => (x === 0 ? 1 : Math.sin(x) / x) ** 2, expr: '(sin(x) / x)²', tonal: false },
  chirp: { name: 'chirp', fn: (x) => Math.sin(x * x), expr: 'sin(x²)', tonal: false },
  octave: { name: 'octave', fn: (x) => Math.sin(x) + Math.sin(2 * x), expr: 'sin(x) + sin(2x)', tonal: false },
  majorChord: { name: 'major chord', fn: (x) => Math.sin(4 * x) + Math.sin(5 * x) + Math.sin(6 * x), expr: 'sin(4x) + sin(5x) + sin(6x)', tonal: false },
  topologistsSin: { name: "topologist's sin", fn: (x) => x === 0 ? 0 : Math.sin(1 / x), expr: 'sin(1/x)', tonal: false },
  morletWavelet: { name: 'morlet wavelet', fn: (x) => Math.exp(-x * x / 2) * Math.sin(x), expr: 'e^(-x²/2) * sin(x)', tonal: false },
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
