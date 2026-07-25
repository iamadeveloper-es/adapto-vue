<script setup lang="ts">
import { ref } from 'vue';
import AdptInputField from './lib/components/form/adpt-input-field/index.vue'
import AdptTextarea from './lib/components/form/adpt-textarea/index.vue'
const inputVal = ref('')
const textareaVal = ref('')
</script>

<template>
  <AdptInputField
  v-model="inputVal"
  name="user"
  label="user Name"
  />
  <br>
  <AdptTextarea
  name="user"
  label="user Name"
  v-model="textareaVal"
  />
</template>
