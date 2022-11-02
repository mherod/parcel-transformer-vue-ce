<template>
  <p data-lol>Sub</p>
</template>

<script lang="ts">
export default {
  name: 'SubComponentX',
  mounted() {
    console.log('SubComponentX mounted')
  }
}
</script>

<style>
p[data-lol] {
  color: greenyellow;
}
</style>
