<script setup lang="ts">
import { ref } from 'vue';
import AdptInputField from './lib/components/form/adpt-input-field/index.vue'
import AdptTextarea from './lib/components/form/adpt-textarea/index.vue'
import AdptCard from './lib/components/element/adpt-card/index.vue'
import AdptButton from './lib/components/element/adpt-button/index.vue'
import AdptCheckbox from './lib/components/form/adpt-checkbox/index.vue'
import AdptRadio from './lib/components/form/adpt-radio/index.vue'

const inputVal = ref('')
const textareaVal = ref('')
const checkInputVal = ref(['Jhon'])
const selectedRadioValue = ref({
  name: 'red',
  age: 4
});

const checkboxesConfig = ref([
  {
    color: 'primary-600',
    label: 'User Jhon',
    value: 'Jhon'
  },
  {
    color: 'warning-500',
    label: 'User pepe',
    value: 'Pepe',
  },
  {
    color: 'danger-500',
    label: 'User Juan',
    value: 'Juan',
  }
]);

const radioColors2 = ref([
  {
    color: 'danger-500',
    val: {
      name: 'red',
      age: 4
    },
    label: 'Color Red'
  },
  {
    color: 'blue-400',
    val: {
      name: 'blue',
      age: 44
    },
    label: 'Color Blue'
  },
  {
    color: 'primary-300',
    val: {
      name: 'primary',
      age: 14
    },
    label: 'Color Primary'
  }
]);
</script>

<template>
  <AdptCheckbox
  v-for="(item, index) in checkboxesConfig"
  :key="index"
  v-model="checkInputVal"
  :active-color="item.color"
  :label="item.label"
  :value="item.value"
  :name="'check-'+index"
  />
  <div>
    Valores seleccionados: {{ checkInputVal.join(', ') }}
  </div>
  <br>
  <AdptRadio
  v-for="item in radioColors2"
  :key="item.val"
  v-model="selectedRadioValue"
  :active-color="item.color"
  :disabled="item.disabled"
  :label="item.label"
  :value="item.val"
  name="test2"
  />
  <br>
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
  <br>
  <br>
  <div class="d-flex1">
    <div class="flex-item" v-for="item in 7" :key="item">
      <AdptCard
      image-overlap
      :title-color="'white-500'"
      subtitle-color="white-500"
      title-overlap-position="center">
        <template #media>
          <img src="https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg" alt="">
        </template>
        <template #title>
          Título de la card
        </template>
        <template #subtitle>
          Subtítulo de la card
        </template>
        <template #footer>
          <AdptButton />
        </template>
      </AdptCard>
    </div>
    <div class="flex-item" v-for="item in 7" :key="item">
      <AdptCard
      >
        <template #media>
          <img src="https://cdn.vuetifyjs.com/docs/images/cards/purple-flowers.jpg" alt="">
        </template>
        <template #title>
          Título de la card
        </template>
        <template #subtitle>
          Subtítulo de la card
        </template>
        <template #body>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi mollitia nesciunt officiis corrupti accusantium. Beatae, natus dolores officiis soluta labore dignissimos optio provident similique repellendus atque autem nesciunt illo ipsa.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi mollitia nesciunt officiis corrupti accusantium. Beatae, natus dolores officiis soluta labore dignissimos optio provident similique repellendus atque autem nesciunt illo ipsa.</p>
        </template>
        <template #footer>
          <AdptButton />
        </template>
      </AdptCard>
    </div>
  </div>
</template>

<style lang="scss">
.d-flex1{
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;

  .flex-item{
    flex-grow: 1;
  }
}
</style>
