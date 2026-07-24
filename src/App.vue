<script setup lang="ts">
import { ref } from 'vue';
import AppButton from './lib/components/adpt-button/index.vue';
import AdaptoDialog from './lib/components/adpt-dialog/index.vue';

const modal = ref<HTMLDialogElement | null>(null);

const toggleDialog = () => {
  modal.value?.open();
};
</script>

<template>
  <h1>Aplicación Sandbox dentro de librería</h1>
<AppButton variant="soft" size="xs" :color="'green-100'" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="sm" color="primary-500" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="md" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="lg" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="xl" :icon="{name: 'alarm-clock'}" @clicked="toggleDialog"/>

<AdaptoDialog ref="modal">
  <template #header>
    <h2>Dialog Header</h2>
  </template>
  <template #body>
    <p>This is the body of the dialog.</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi commodi eos nostrum, accusamus dicta ratione porro quibusdam architecto amet. Tenetur ab assumenda consequatur aliquam maiores! Impedit pariatur ratione officia unde. Incidunt obcaecati modi repellendus quisquam voluptatum perferendis minima veritatis voluptate harum officiis. Voluptas quibusdam quod voluptatum debitis ullam, eius, ut repudiandae unde suscipit odit excepturi doloribus maiores voluptatibus aperiam inventore quae nesciunt illo ipsum numquam quidem tempora, sit modi minus adipisci. Commodi ducimus pariatur, laboriosam magnam adipisci eius facere placeat omnis voluptate dolore cum quos eum blanditiis, est eligendi iure esse maxime? Dicta inventore fugit facilis ab quod alias, unde, ullam quidem, neque error fugiat non officia minus voluptate vel amet dolores delectus explicabo eveniet? Vitae totam, nihil tempora recusandae quo magnam a repudiandae provident, iure odit labore? Pariatur quae ipsam corrupti earum sapiente modi corporis, qui itaque tenetur! Nostrum assumenda at sint praesentium in rerum illo saepe a exercitationem expedita magnam, commodi blanditiis adipisci! Et quia amet corrupti repellendus reiciendis saepe voluptatum natus dignissimos, quisquam dolorem. Expedita dolores aspernatur molestiae consequuntur accusamus illum facere deleniti? Mollitia et iste doloremque esse, neque ut? Nam vel, ratione, aliquid, blanditiis porro dignissimos eos numquam reiciendis beatae consequuntur sed magnam cum quibusdam non?</p>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi commodi eos nostrum, accusamus dicta ratione porro quibusdam architecto amet. Tenetur ab assumenda consequatur aliquam maiores! Impedit pariatur ratione officia unde. Incidunt obcaecati modi repellendus quisquam voluptatum perferendis minima veritatis voluptate harum officiis. Voluptas quibusdam quod voluptatum debitis ullam, eius, ut repudiandae unde suscipit odit excepturi doloribus maiores voluptatibus aperiam inventore quae nesciunt illo ipsum numquam quidem tempora, sit modi minus adipisci. Commodi ducimus pariatur, laboriosam magnam adipisci eius facere placeat omnis voluptate dolore cum quos eum blanditiis, est eligendi iure esse maxime? Dicta inventore fugit facilis ab quod alias, unde, ullam quidem, neque error fugiat non officia minus voluptate vel amet dolores delectus explicabo eveniet? Vitae totam, nihil tempora recusandae quo magnam a repudiandae provident, iure odit labore? Pariatur quae ipsam corrupti earum sapiente modi corporis, qui itaque tenetur! Nostrum assumenda at sint praesentium in rerum illo saepe a exercitationem expedita magnam, commodi blanditiis adipisci! Et quia amet corrupti repellendus reiciendis saepe voluptatum natus dignissimos, quisquam dolorem. Expedita dolores aspernatur molestiae consequuntur accusamus illum facere deleniti? Mollitia et iste doloremque esse, neque ut? Nam vel, ratione, aliquid, blanditiis porro dignissimos eos numquam reiciendis beatae consequuntur sed magnam cum quibusdam non?</p>
  </template>
  <template #footer>
    <button @click="modal?.close()">Close</button>
  </template>
</AdaptoDialog>
</template>

<style scoped></style>
