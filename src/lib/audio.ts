import processorUrl from './worklets/sine-processor.ts?worker&url'

export class AudioPlayer {
  private audioCtx: AudioContext | null = null
  private node: AudioWorkletNode | null = null

  async start(): Promise<void> {
    if (this.audioCtx) return
    this.audioCtx = new AudioContext()
    await this.audioCtx.audioWorklet.addModule(processorUrl)
    this.node = new AudioWorkletNode(this.audioCtx, 'sine-processor')
    this.node.connect(this.audioCtx.destination)
  }

  stop(): void {
    this.node?.disconnect()
    this.audioCtx?.close()
    this.node = null
    this.audioCtx = null
  }
}
