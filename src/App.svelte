<script lang="ts">
  import { onMount } from 'svelte'
  import { evaluate } from 'mathjs'
  import * as fp from 'function-plot'
  const functionPlot = (fp as any).default?.default ?? (fp as any).default ?? fp

  let expr = $state('1 + 1')
  let result = $derived.by(() => {
    try {
      return String(evaluate(expr))
    } catch {
      return 'error'
    }
  })

  let container: HTMLDivElement

  onMount(() => {
    functionPlot({
      target: container,
      data: [{ fn: 'x' }],
    })
  })
</script>

<main>
  <h1>Math Playground</h1>
  <input bind:value={expr} />
  <p>= {result}</p>
  <div bind:this={container}></div>
</main>

<style>
</style>
