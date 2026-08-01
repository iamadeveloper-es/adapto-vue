<script setup lang="ts">
import { computed, type Component } from 'vue';
import * as icons from "lucide-vue-next";
import { useFramework } from '../../../composables/useFramework'

const fw = useFramework()

const cmpClass = fw.cx('icon')

defineOptions({
  name: 'AdaptoIcon',
})

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 24
  },
  color: {
    type: String,
    default: undefined
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  defaultClass: {
    type: [String, null],
    default: null
  },
});

// El módulo de lucide exporta también helpers que no son componentes, así que el
// lookup dinámico se acota a Component para que `<component :is>` lo acepte.
const icon = computed<Component | undefined>(() => {
  const nameToString = String(props.name);
  const formattedName = nameToString
    .split('-')
    .map((item) => item.charAt(0).toUpperCase() + item.substring(1))
    .join('');

  return icons[formattedName as keyof typeof icons] as Component | undefined;
});
</script>

<template>
  <component
    :is="icon"
    :class="cmpClass"
    :size="size"
    :color="color"
    :stroke-width="strokeWidth"
    :default-class="defaultClass"
  />
</template>
