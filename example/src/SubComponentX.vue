<!--suppress JSUnusedGlobalSymbols -->
<template>
  <div>
    <p>Sub</p>
  </div>
</template>

<script lang="ts">
export default {
  name: "SubComponentX",
  mounted: function() {
    console.log("SubComponentX mounted");
  }
};
</script>

<style scoped>
p {
  color: greenyellow;
}
</style>
