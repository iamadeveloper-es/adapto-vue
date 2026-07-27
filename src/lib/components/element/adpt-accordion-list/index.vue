<script lang="ts">
export interface AccordionContext {
  opened: Ref<string | null>,
  isList: boolean,
  toggle: (id: string) => void
}

export const AccordionKey = Symbol() as InjectionKey<AccordionContext>
</script>

<script lang="ts" setup>
import { provide, ref, type InjectionKey, type Ref } from 'vue'
import { useFramework } from '@/lib/composables/useFramework'


const fw = useFramework()

const cmpClass = fw.cx('accordion-list')

defineOptions({
  name: 'AdaptoAccordionList',
})

const opened = ref<string | null>(null)
const isList = true

function toggle(id: string) {
  opened.value = opened.value === id ? null : id
}

provide(AccordionKey, {
  opened,
  isList,
  toggle
})

</script>

<template>
  <div :class="cmpClass">
    <slot />
  </div>
</template>
