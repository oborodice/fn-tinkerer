<script lang="ts">
  import * as fp from 'function-plot'
  import { AudioPlayer } from './lib/audio'
  import { hzToNoteName } from './lib/music'
  import { waveforms } from './lib/waveforms'
  const functionPlot = (fp as any).default?.default ?? (fp as any).default ?? fp

  const player = new AudioPlayer()
  let playing = $state(false)

  let fn = $state('sin')
  let amplitude = $state(1)
  let freqSlider = $state(50)
  let frequency = $derived(0.25 * Math.pow(16, freqSlider / 100))
  let phase = $state(0)
  let container: HTMLDivElement

  let displayExpr = $derived(
    `${amplitude} * (${waveforms[fn].expr.replace(/\bx\b/g, `(${frequency} * x + ${phase})`)})`
  )

  let noteLabel = $derived(fn !== 'tan' ? `${Math.round(frequency * 440)}Hz / ${hzToNoteName(frequency * 440)}` : '')

  async function togglePlay() {
    if (playing) {
      player.stop()
      playing = false
      return
    }
    await player.start()
    player.setWaveform(fn)
    player.tune({ amplitude, frequency, phase })
    playing = true
  }

  $effect(() => {
    try {
      functionPlot({
        target: container,
        xAxis: { domain: [-10, 10] },
        yAxis: { domain: [-2, 2] },
        data: [{ fn: displayExpr }],
      })
    } catch {}
  })

  $effect(() => {
    player.tune({ amplitude, frequency, phase })
  })

  $effect(() => {
    player.setWaveform(fn)
  })
</script>

<main>
  <h1>Fn Tinkerer</h1>
  <select bind:value={fn}>
    {#each Object.keys(waveforms) as key}
      <option value={key}>{key}</option>
    {/each}
  </select>
  <p>f(x) = {displayExpr}</p>
  <label>
    Amplitude: {(amplitude >= 0 ? '+' : '') + amplitude.toFixed(1)}
    <input type="range" min="-1" max="1" step="0.01" bind:value={amplitude} />
  </label>
  <label>
    Frequency: {frequency.toFixed(2)}<span class="note-label">{noteLabel ? ` (${noteLabel})` : ''}</span>
    <input type="range" min="0" max="100" step="1" bind:value={freqSlider} />
  </label>
  <label>
    Phase: {(phase >= 0 ? '+' : '') + phase.toFixed(1)}
    <input type="range" min="-6.3" max="6.3" step="0.1" bind:value={phase} />
  </label>
  <label>
    Sound:
    <button onclick={togglePlay}>
      {playing ? 'Stop' : 'Play'}
    </button>
  </label>
  <div bind:this={container}></div>
</main>

<style>
  label {
    display: block;
    font-variant-numeric: tabular-nums;
  }

  .note-label {
    display: inline-block;
    width: 12ch;
  }
</style>
