<script setup lang="ts">
import { reactive, ref } from 'vue';
import AdptSelect from './lib/components/form/adpt-select/index.vue'
import AdptChip from './lib/components/element/adpt-chip/index.vue'

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

const showAlert = () => {
  alert('Chip clickada!!')
}
</script>

<template>
<AdptSelect
v-model="selectedValue"
:options="options"
></AdptSelect>
<br>
<br>
<AdptChip
label="Chip"
:icon-prepend="{name: 'hard-drive-download'}"
:icon-append="{name: 'cat'}" closable @clicked="showAlert"/>
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
