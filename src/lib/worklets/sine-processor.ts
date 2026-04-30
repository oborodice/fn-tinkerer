declare const sampleRate: number
declare abstract class AudioWorkletProcessor {
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean
}
declare function registerProcessor(name: string, ctor: new () => AudioWorkletProcessor): void

class SineProcessor extends AudioWorkletProcessor {
  private phase = 0

  static get parameterDescriptors() {
    return [
      { name: 'amplitude', defaultValue: 1, minValue: -1, maxValue: 1, automationRate: 'k-rate' },
      { name: 'frequency', defaultValue: 1, minValue: 0.25, maxValue: 4, automationRate: 'k-rate' },
      { name: 'phase', defaultValue: 0, minValue: -6.3, maxValue: 6.3, automationRate: 'k-rate' },
    ]
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    const output = outputs[0][0]
    const amplitude = parameters.amplitude[0]
    const frequency = parameters.frequency[0]
    const phaseOffset = parameters.phase[0]
    const increment = (2 * Math.PI * frequency * 440) / sampleRate

    for (let i = 0; i < output.length; i++) {
      output[i] = amplitude * Math.sin(this.phase + phaseOffset)
      this.phase += increment
      if (this.phase > 2 * Math.PI) this.phase -= 2 * Math.PI
    }

    return true
  }
}

registerProcessor('sine-processor', SineProcessor)
