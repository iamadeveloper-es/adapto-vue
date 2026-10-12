<script setup lang="ts">
import { reactive, ref } from 'vue'
import AdaptoPagination from './lib/components/navigation/adpt-pagination/index.vue'
import AdaptoProgressBar from './lib/components/element/adpt-progress/index.vue'
import AdaptoProgressCircular from './lib/components/element/adpt-progress-circular/index.vue'

import AdaptoBreadcrumbs from './lib/components/navigation/adpt-breadcrumbs/index.vue'
import AdaptoRange from './lib/components/form/adpt-range/index.vue';

const selectedValue = ref('')
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

const checkError = (event: Event) => {
  const img = event.target as HTMLImageElement

  console.log(img.src)
}

const activeTab = ref('profile')

const tabs = [
  { label: 'Perfil', value: 'profile' },
  { label: 'Ajustes', value: 'settings' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Deshabilitado', value: 'disabled', disabled: true },
]

const breadcrumbsItems = ref([
  {
    label: 'Link 1',
    route: 'link-1',
    disable: false
  },
  {
    label: 'Link 2',
    route: 'link-2',
    disable: false
  },
  {
    label: 'Link 3',
    route: 'link-3',
    disable: true
  }
])

const percent = ref(77)

const progress = () => {
  setInterval(() => {
    percent.value++
  }, 0)
}

const circularValue = ref(25)
// progress()
let progressInterval: ReturnType<typeof setInterval> | undefined
function updateProgress() {
  clearInterval(progressInterval)

  progressInterval = setInterval(() => {
    if (circularValue.value >= 100) {
      clearInterval(progressInterval)
      progressInterval = undefined
      return
    }
    circularValue.value += 5
  }, 500)
}

updateProgress()

//Paginación
const page = ref(2)

// setInterval(() => {
//   page.value = Math.floor(Math.random() * 6) + 1
// }, 2000)
const paginationLength = ref(10)
const totalVisible = ref(4)

const range = ref(10)
</script>

<template>
  <AdaptoBreadcrumbs :items="breadcrumbsItems" :link-component="'a'" />
  <!-- <AdptSelect v-model="selectedValue" :options="options"></AdptSelect> -->
  <br>
  <br>
  <!-- <AdptChip label="Chip" :prepend-icon="{ name: 'hard-drive-download' }" :append-icon="{ name: 'cat' }" closable
    @clicked="showAlert" /> -->
  <br><br>
  <AdaptoRange v-model="range" show-value/>
  <AdaptoPagination v-model="page" :length="paginationLength" items-variant="soft" show-last-first />
  <!-- <AdaptoProgressCircular v-model="circularValue" :width="4" size="xl" show-label indeterminate/>
  <AdaptoProgressBar v-model="percent" :height="11" /> -->
</template>

<style lang="scss">
.space {
  margin-bottom: 500px;
}

.d-flex1 {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;

  .flex-item {
    flex-grow: 1;
  }
}
</style>
