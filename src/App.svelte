<script lang="ts">
  import * as fp from 'function-plot'
  const functionPlot = (fp as any).default?.default ?? (fp as any).default ?? fp

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
        data: [{ fn: displayExpr }],
      })
    } catch {}
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
    <input type="range" min="-3" max="3" step="0.1" bind:value={amplitude} />
  </label>
  <label>
    Frequency: {(frequency >= 0 ? '+' : '') + frequency.toFixed(1)}
    <input type="range" min="-5" max="5" step="0.1" bind:value={frequency} />
  </label>
  <label>
    Phase: {(phase >= 0 ? '+' : '') + phase.toFixed(1)}
    <input type="range" min="-6.3" max="6.3" step="0.1" bind:value={phase} />
  </label>
  <div bind:this={container}></div>
</main>

<style>
</style>
