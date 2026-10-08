<script lang="ts" setup>
import { useFramework } from '@/lib/composables/useFramework'
import { useStyle } from '@/lib/composables/useStyle'
import css from './style.scss?raw'
import { computed, type PropType } from 'vue'


const fw = useFramework()

useStyle('breadcrumbs', css)

const cmpClass = fw.cx('breadcrumbs')

defineOptions({
  name: 'AdaptoBreadcrumbs',
})

type BreadCrumbsItems = {
  label: string,
  route: string,
  disable: boolean
}
type BreadCrumbsDivider = '/'
const props = defineProps({
  items: {
    type: Array as PropType<BreadCrumbsItems[]>,
    required: true
  },
  linkComponent: {
    type: String,
    default: 'a'
  },
  divider: {
    type: String as PropType<BreadCrumbsDivider>,
    default: '/'
  }
})

const ishref = computed(() => props.linkComponent === 'a')

</script>

<template>
  <ul :class="cmpClass">
    <li v-for="(item, index) in items" :key="index">
      <component :is="linkComponent" :to="!ishref ? item.route : undefined" :href="ishref ? item.route : undefined" :class="[`${cmpClass}__link`, {'disabled' : item.disable}]"
      :aria-disabled="item.disable ? true : undefined"
      :tabindex="item.disable ? '-1' : undefined">
        {{ item.label }}
        <span v-if="index + 1 != items?.length">{{ divider }}</span>
      </component>
    </li>
  </ul>
</template>
