import processorUrl from './worklets/wave-processor.ts?worker&url'

export class AudioPlayer {
  private audioCtx: AudioContext | null = null
  private node: AudioWorkletNode | null = null

  async start(): Promise<void> {
    if (this.audioCtx) return
    this.audioCtx = new AudioContext()
    await this.audioCtx.audioWorklet.addModule(processorUrl)
    this.node = new AudioWorkletNode(this.audioCtx, 'wave-processor')
    this.node.connect(this.audioCtx.destination)
  }

  stop(): void {
    this.node?.disconnect()
    this.audioCtx?.close()
    this.node = null
    this.audioCtx = null
  }

  setWaveform(fn: string): void {
    this.node?.port.postMessage({ fn })
  }

  tune(params: { amplitude?: number; frequency?: number; phase?: number }): void {
    if (!this.node) return
    for (const [key, value] of Object.entries(params) as [string, number][]) {
      const param = this.node.parameters.get(key)
      if (param) param.value = value
    }
  }
}
