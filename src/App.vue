<script setup lang="ts">
import { ref } from 'vue';
import AdptCalendar from './lib/components/element/adpt-calendar/index.vue'


const date = ref('2019-01-25')
</script>

<template>
<AdptCalendar/>
</template>

<style lang="scss">
.space{
  margin-bottom: 500px;
}
.d-flex1{
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;

  .flex-item{
    flex-grow: 1;
  }
}
</style>
