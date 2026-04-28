<script lang="ts">
  import { evaluate } from 'mathjs'

  let expr = $state('1 + 1')
  let result = $derived.by(() => {
    try {
      return String(evaluate(expr))
    } catch {
      return 'error'
    }
  })
</script>

<main>
  <h1>Math Playground</h1>
  <input bind:value={expr} />
  <p>= {result}</p>
</main>

<style>
</style>
