declare const sampleRate: number
declare abstract class AudioWorkletProcessor {
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean
}
declare function registerProcessor(name: string, ctor: new () => AudioWorkletProcessor): void

class SineProcessor extends AudioWorkletProcessor {
  private phase = 0

  process(_inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const output = outputs[0][0]
    const increment = (2 * Math.PI * 440) / sampleRate

    for (let i = 0; i < output.length; i++) {
      output[i] = Math.sin(this.phase)
      this.phase += increment
      if (this.phase > 2 * Math.PI) this.phase -= 2 * Math.PI
    }

    return true
  }
}

registerProcessor('sine-processor', SineProcessor)
