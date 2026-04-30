<script lang="ts">
  import * as fp from 'function-plot'
  import { AudioPlayer } from './lib/audio'
  const functionPlot = (fp as any).default?.default ?? (fp as any).default ?? fp

  const player = new AudioPlayer()
  let playing = $state(false)

  let fn = $state('sin')
  let amplitude = $state(1)
  let frequency = $state(1)
  let phase = $state(0)
  let container: HTMLDivElement

  let displayExpr = $derived(`${amplitude} * ${fn}(${frequency} * x + ${phase})`)

  $effect(() => {
    try {
      functionPlot({
        target: container,
        xAxis: { domain: [-10, 10] },
        yAxis: { domain: [-6, 6] },
        data: [{ fn: displayExpr }],
      })
    } catch {}
  })

  $effect(() => {
    player.setParams({ amplitude, frequency, phase })
  })
</script>

<main>
  <h1>Fn Tinkerer</h1>
  <select bind:value={fn}>
    <option value="sin">sin</option>
    <option value="cos">cos</option>
    <option value="tan">tan</option>
  </select>
  <p>f(x) = {displayExpr}</p>
  <label>
    Amplitude: {(amplitude >= 0 ? '+' : '') + amplitude.toFixed(1)}
    <input type="range" min="-5" max="5" step="0.1" bind:value={amplitude} />
  </label>
  <label>
    Frequency: {(frequency >= 0 ? '+' : '') + frequency.toFixed(1)}
    <input type="range" min="-5" max="5" step="0.1" bind:value={frequency} />
  </label>
  <label>
    Phase: {(phase >= 0 ? '+' : '') + phase.toFixed(1)}
    <input type="range" min="-6.3" max="6.3" step="0.1" bind:value={phase} />
  </label>
  <label>
    Sound:
    <button onclick={async () => {
      if (playing) { player.stop(); playing = false }
      else { await player.start(); playing = true }
    }}>
      {playing ? 'Stop' : 'Play'}
    </button>
  </label>
  <div bind:this={container}></div>
</main>

<style>
</style>
