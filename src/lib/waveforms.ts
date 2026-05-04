const frac = (x: number) => x - Math.floor(x)

const factorial = (n: number) => {
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

type Waveform = {
  name: string
  fn: (x: number, params?: Record<string, number>) => number
  expr: (amplitude: number, frequency: number, phase: number, params?: Record<string, number>) => string
  tonal: boolean
}

const fx = (f: number, p: number) => `${f.toFixed(2)} * x + ${p.toFixed(1)}`
const wrap = (a: number, inner: string) => `${a.toFixed(2)} * (${inner})`

export const waveforms: Record<string, Waveform> = {
  sin: { name: 'sin', fn: Math.sin, expr: (a, f, p) => wrap(a, `sin(${fx(f, p)})`), tonal: true },
  cos: { name: 'cos', fn: Math.cos, expr: (a, f, p) => wrap(a, `cos(${fx(f, p)})`), tonal: true },
  tan: { name: 'tan', fn: Math.tan, expr: (a, f, p) => wrap(a, `tan(${fx(f, p)})`), tonal: false },
  sec: { name: 'sec', fn: (x) => 1 / Math.cos(x), expr: (a, f, p) => wrap(a, `1/cos(${fx(f, p)})`), tonal: false },
  csc: { name: 'csc', fn: (x) => 1 / Math.sin(x), expr: (a, f, p) => wrap(a, `1/sin(${fx(f, p)})`), tonal: false },
  cot: { name: 'cot', fn: (x) => 1 / Math.tan(x), expr: (a, f, p) => wrap(a, `1/tan(${fx(f, p)})`), tonal: false },
  square: {
    name: 'square',
    fn: (x) => Math.sign(Math.sin(x)),
    expr: (a, f, p) => wrap(a, `sgn(sin(${fx(f, p)}))`),
    tonal: true,
  },
  sawtooth: {
    name: 'sawtooth',
    fn: (x) => 2 * frac(x / (2 * Math.PI)) - 1,
    expr: (a, f, p) => wrap(a, `2 * frac(${fx(f, p)} / 2π) - 1`),
    tonal: true,
  },
  triangle: {
    name: 'triangle',
    fn: (x) => 2 * Math.abs(2 * frac(x / (2 * Math.PI)) - 1) - 1,
    expr: (a, f, p) => wrap(a, `2 * |2 * frac(${fx(f, p)} / 2π) - 1| - 1`),
    tonal: true,
  },
  absSin: {
    name: 'rectified sin',
    fn: (x) => Math.abs(Math.sin(x)),
    expr: (a, f, p) => wrap(a, `|sin(${fx(f, p)})|`),
    tonal: true,
  },
  sinc: {
    name: 'sinc',
    fn: (x) => x === 0 ? 1 : Math.sin(x) / x,
    expr: (a, f, p) => wrap(a, `sin(${fx(f, p)}) / (${fx(f, p)})`),
    tonal: false,
  },
  sinc2: {
    name: 'sinc²',
    fn: (x) => (x === 0 ? 1 : Math.sin(x) / x) ** 2,
    expr: (a, f, p) => wrap(a, `(sin(${fx(f, p)}) / (${fx(f, p)}))²`),
    tonal: false,
  },
  octave: {
    name: 'octave',
    fn: (x) => Math.sin(x) + Math.sin(2 * x),
    expr: (a, f, p) => wrap(a, `sin(${fx(f, p)}) + sin(2(${fx(f, p)}))`),
    tonal: false,
  },
  majorChord: {
    name: 'major chord',
    fn: (x) => Math.sin(4 * x) + Math.sin(5 * x) + Math.sin(6 * x),
    expr: (a, f, p) => wrap(a, `sin(4(${fx(f, p)})) + sin(5(${fx(f, p)})) + sin(6(${fx(f, p)}))`),
    tonal: false,
  },
  chirp: {
    name: 'chirp',
    fn: (x) => Math.sin(x * x),
    expr: (a, f, p) => wrap(a, `sin((${fx(f, p)})²)`),
    tonal: false,
  },
  topologistsSin: {
    name: "topologist's sin",
    fn: (x) => x === 0 ? 0 : Math.sin(1 / x),
    expr: (a, f, p) => wrap(a, `sin(1/(${fx(f, p)}))`),
    tonal: false,
  },
  morletWavelet: {
    name: 'morlet wavelet',
    fn: (x) => Math.exp(-x * x / 2) * Math.sin(x),
    expr: (a, f, p) => wrap(a, `e^(-(${fx(f, p)})²/2) * sin(${fx(f, p)})`),
    tonal: false,
  },
  maclaurinSin: {
    name: 'maclaurin sin',
    fn: (x, params) => {
      let sum = 0
      for (let n = 0; n < params!.terms; n++) {
        sum += ((-1) ** n * x ** (2 * n + 1)) / factorial(2 * n + 1)
      }
      return sum
    },
    expr: (a, f, p, params) => wrap(a, `Σ [n=0..${params!.terms - 1}] (-1)ⁿ (${fx(f, p)})²ⁿ⁺¹/(2n+1)!`),
    tonal: false,
  },
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
    if (!isFinite(y)) {
      segments.push([])
      prevY = NaN
      continue
    }
    if ((prevY > discontinuityThreshold && y < -discontinuityThreshold) || (prevY < -discontinuityThreshold && y > discontinuityThreshold)) {
      segments.push([])
    }
    segments[segments.length - 1].push([x, y])
    prevY = y
  }
  return segments.filter(s => s.length > 0)
}
