export function hzToNoteName(hz: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const midi = Math.round(69 + 12 * Math.log2(hz / 440))
  const octave = Math.floor(midi / 12) - 1
  return noteNames[midi % 12] + octave
}
