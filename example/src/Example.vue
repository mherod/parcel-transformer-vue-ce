<template>
  <h1>Title</h1>
  <p>Hello world</p>
  <SubComponentX/>
</template>

<script lang="ts">
import SubComponentX from "./SubComponentX.vue";

export default {
  name: "Example",
  components: {SubComponentX},
};
</script>

<style>
h1 {
  color: red;
}

p {
  color: blue;
}
</style>
