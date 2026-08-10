<script setup lang="ts">
import { reactive, ref } from 'vue'
import AdptSelect from './lib/components/form/adpt-select/index.vue'
import AdptImage from './lib/components/element/adpt-image/index.vue'
import AdptChip from './lib/components/element/adpt-chip/index.vue'
import AdaptoTabs from './lib/components/navigation/adpt-tabs/index.vue'

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
  { label: 'Perfil', value: 'profile'},
  { label: 'Ajustes', value: 'settings'},
  { label: 'Landscape', value: 'landscape'},
  { label: 'Deshabilitado', value: 'disabled', disabled: true },
]
</script>

<template>
  <AdptSelect v-model="selectedValue" :options="options"></AdptSelect>
  <br>
  <br>
  <!-- <AdptChip label="Chip" :prepend-icon="{ name: 'hard-drive-download' }" :append-icon="{ name: 'cat' }" closable
    @clicked="showAlert" /> -->
  <br><br>
<!-- <AdptImage src="https://picsum.photos/id/237/200/300" width="100%" aspect-ratio="9/16" @on-error="checkError"/> -->

  <!-- <AdaptoTabs v-model="activeTab" :tabs="tabs" :size="'xl'" tabs-align="center">
    <template #profile>
      <p>Contenido del perfil.</p>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa suscipit modi aperiam nostrum consequatur accusamus, earum atque aut fugiat in temporibus error laboriosam minus amet voluptatibus cumque voluptatem, et, molestiae quaerat! Omnis nam optio ratione! Quisquam expedita sapiente hic aspernatur esse cum! Quasi suscipit perferendis qui! Ullam, beatae ab aliquid ipsam vitae quis eaque quo totam debitis cupiditate dolorum tempora, nostrum quae pariatur facere, minima repellat harum vel error sed consequuntur laborum delectus quidem assumenda! Eaque nihil, praesentium corrupti ullam est placeat accusamus? Similique, quos corrupti magnam dolorum natus, et culpa delectus, nisi nihil fugiat sed quo? Enim aliquid autem recusandae voluptate quaerat quod aspernatur cumque dolor nisi, animi ipsam repellendus sit nesciunt optio mollitia aperiam nostrum voluptatum esse dignissimos ex! Velit, sed corrupti recusandae sit perferendis consequuntur ipsum iure! Omnis explicabo velit eveniet dolorum suscipit, blanditiis nisi molestias cumque esse dicta debitis ab sit magnam itaque possimus deleniti maxime, error laboriosam voluptates deserunt, magni maiores in. Consequuntur libero officiis quaerat, deserunt aperiam quis sapiente maiores explicabo aut placeat repellendus suscipit magni totam dicta quasi voluptatum sequi, iusto unde vitae consectetur! Nostrum, debitis perspiciatis iusto vitae repudiandae modi inventore quod soluta ipsum atque culpa doloremque fugit illum cum temporibus et aut dolorum eaque voluptas at vero! Laudantium quisquam cupiditate unde blanditiis. Architecto consectetur commodi ab sapiente officia eligendi sit inventore necessitatibus tempore iusto, debitis, consequatur ducimus vero molestiae odit nisi porro unde. Harum corrupti blanditiis, minima asperiores facilis, fuga modi dignissimos beatae deserunt sequi amet doloribus, aspernatur voluptate maiores necessitatibus ut ullam dolorum inventore ex illo? Non, magnam odio? Magni nulla asperiores ut tempore iusto aliquid suscipit, eveniet, blanditiis odio nostrum laudantium atque doloribus in non sapiente inventore sequi iure temporibus, voluptatem adipisci repellat eius. Vel molestiae optio culpa dolor quos accusantium cumque commodi, quasi, doloremque iste maxime perspiciatis tempora.</p>
    </template>
    <template #settings>
      <p>Contenido de ajustes.</p>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa suscipit modi aperiam nostrum consequatur accusamus, earum atque aut fugiat in temporibus error laboriosam minus amet voluptatibus cumque voluptatem, et, molestiae quaerat! Omnis nam optio ratione! Quisquam expedita sapiente hic aspernatur esse cum! Quasi suscipit perferendis qui! Ullam, beatae ab aliquid ipsam vitae quis eaque quo totam debitis cupiditate dolorum tempora, nostrum quae pariatur facere, minima repellat harum vel error sed consequuntur laborum delectus quidem assumenda! Eaque nihil, praesentium corrupti ullam est placeat accusamus? Similique, quos corrupti magnam dolorum natus, et culpa delectus, nisi nihil fugiat sed quo? Enim aliquid autem recusandae voluptate quaerat quod aspernatur cumque dolor nisi, animi ipsam repellendus sit nesciunt optio mollitia aperiam nostrum voluptatum esse dignissimos ex! Velit, sed corrupti recusandae sit perferendis consequuntur ipsum iure! Omnis explicabo velit eveniet dolorum suscipit, blanditiis nisi molestias cumque esse dicta debitis ab sit magnam itaque possimus deleniti maxime, error laboriosam voluptates deserunt, magni maiores in. Consequuntur libero officiis quaerat, deserunt aperiam quis sapiente maiores explicabo aut placeat repellendus suscipit magni totam dicta quasi voluptatum sequi, iusto unde vitae consectetur! Nostrum, debitis perspiciatis iusto vitae repudiandae modi inventore quod soluta ipsum atque culpa doloremque fugit illum cum temporibus et aut dolorum eaque voluptas at vero! Laudantium quisquam cupiditate unde blanditiis. Architecto consectetur commodi ab sapiente officia eligendi sit inventore necessitatibus tempore iusto, debitis, consequatur ducimus vero molestiae odit nisi porro unde. Harum corrupti blanditiis, minima asperiores facilis, fuga modi dignissimos beatae deserunt sequi amet doloribus, aspernatur voluptate maiores necessitatibus ut ullam dolorum inventore ex illo? Non, magnam odio? Magni nulla asperiores ut tempore iusto aliquid suscipit, eveniet, blanditiis odio nostrum laudantium atque doloribus in non sapiente inventore sequi iure temporibus, voluptatem adipisci repellat eius. Vel molestiae optio culpa dolor quos accusantium cumque commodi, quasi, doloremque iste maxime perspiciatis tempora.</p>
    </template>
    <template #landscape>
      <p>Contenido de Landscape.</p>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa suscipit modi aperiam nostrum consequatur accusamus, earum atque aut fugiat in temporibus error laboriosam minus amet voluptatibus cumque voluptatem, et, molestiae quaerat! Omnis nam optio ratione! Quisquam expedita sapiente hic aspernatur esse cum! Quasi suscipit perferendis qui! Ullam, beatae ab aliquid ipsam vitae quis eaque quo totam debitis cupiditate dolorum tempora, nostrum quae pariatur facere, minima repellat harum vel error sed consequuntur laborum delectus quidem assumenda! Eaque nihil, praesentium corrupti ullam est placeat accusamus? Similique, quos corrupti magnam dolorum natus, et culpa delectus, nisi nihil fugiat sed quo? Enim aliquid autem recusandae voluptate quaerat quod aspernatur cumque dolor nisi.</p>
    </template>
  </AdaptoTabs> -->
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
