<script setup lang="ts">
import { ref } from 'vue';
import AdptAccordion from './lib/components/element/adpt-accordion/index.vue'
import AdptAccordionList from './lib/components/element/adpt-accordion-list/index.vue'

const openAccordion = ref(false)
// const openAccordion = ref(false)

</script>

<template>

<AdptAccordion title="Otro título" v-model="openAccordion">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur ea distinctio delectus eos rerum hic impedit perferendis repudiandae nesciunt sed. Excepturi inventore distinctio amet doloremque vero sequi corrupti sint ipsum.
  </p>
</AdptAccordion>

<div class="space"></div>
<AdptAccordionList>
  <AdptAccordion
  v-for="(item, index) in 4"
  :key="index"
  title="Otro título"
  >
  <p v-if="index > 0">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur ea distinctio delectus eos rerum hic impedit perferendis repudiandae nesciunt sed. Excepturi inventore distinctio amet doloremque vero sequi corrupti sint ipsum.
  </p>
  <p v-else>Lorem ipsum dolor sit amet consectetur adipisicing elit. In, expedita laboriosam sed, ex suscipit et ea consequatur laborum ut exercitationem nulla quos ducimus maiores fuga odit quia possimus iusto iste consectetur molestiae pariatur dolorem doloremque, cumque illo. Sapiente qui autem, obcaecati voluptates fugiat quos harum cum asperiores possimus libero tenetur corporis nam non deleniti reprehenderit fuga illum? Quam natus illo est excepturi, autem adipisci. Est, reprehenderit iure facilis dignissimos dolor dolorum nesciunt harum velit, odit saepe beatae sed delectus sunt corrupti voluptatem quas tenetur? Cumque, architecto ea a dolore maxime assumenda natus? Vero, similique voluptatum unde sapiente architecto dolorem voluptas!</p>
  </AdptAccordion>
</AdptAccordionList>

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
