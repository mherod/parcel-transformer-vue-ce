<template>
  <main>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <p>Hello world</p>
    <SubComponentX />
  </main>
</template>

<script lang="ts">
import SubComponentX from "./SubComponentX.vue";

export default {
  name: "Example",
  components: {
    SubComponentX
  },
  async mounted() {
    console.log("Component mounted.");
  }
};
</script>

<style lang="less" scoped>
@import "fonts.less";

* {
  .font-heavy;
}

h1 {
  color: red;
}

h2 {
  color: magenta;
}

p {
  color: blue;
}
</style>
