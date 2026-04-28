<script lang="ts">
  import * as fp from 'function-plot'
  const functionPlot = (fp as any).default?.default ?? (fp as any).default ?? fp

  let expr = $state('sin(x)')
  let container: HTMLDivElement

  $effect(() => {
    try {
      functionPlot({
        target: container,
        data: [{ fn: expr }],
      })
    } catch {}
  })
</script>

<main>
  <h1>Fn Tinkerer</h1>
  <input bind:value={expr} />
  <div bind:this={container}></div>
</main>

<style>
</style>
