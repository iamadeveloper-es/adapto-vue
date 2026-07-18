<script setup lang="ts">
import { useFramework } from '../../composables/useFramework';
const fw = useFramework();

</script>

<template>
  <button :class="fw.cx('btn', variant && `btn--${variant}`)">Click me please</button>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
}

</style>
