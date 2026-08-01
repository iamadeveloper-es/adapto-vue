<script setup lang="ts">
import { reactive, ref } from 'vue';
import AdptSelect from './lib/components/form/adpt-select/index.vue'

const selectedValue = ref('');
const options = reactive([
  {
    label: 'option 1',
    value: 'option-1'
  },
  {
    label: 'option 2',
    value: 'option-2'
  },
  {
    label: 'option 3',
    value: 'option-3'
  }
])
</script>

<template>
<AdptSelect
v-model="selectedValue"
:options="options"
></AdptSelect>
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
