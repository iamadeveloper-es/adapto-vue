<script setup lang="ts">
import { ref } from 'vue';
import AppButton from './lib/components/element/adpt-button/index.vue';
import AdaptoDialog from './lib/components/overlay/adpt-dialog/index.vue';
import AdaptoTooltip from './lib/components/overlay/adpt-tooltip/index.vue';

const modal = ref<HTMLDialogElement | null>(null);

const toggleDialog = () => {
  modal.value?.open();
};

const tooltipContent = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima necessitatibus consequatur dolorem, illum facilis obcaecati ab minus sit architecto odio recusandae fugiat perferendis voluptatibus possimus nobis doloribus molestiae deleniti culpa.';
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

<div class="va-tooltip-demo demo">
    <!-- Variante de tooltip -->
    <div class="variant-section">
      <h2>Tooltip</h2>
      <div class="variant-wrapper">
        <div class="flex">
          <AdaptoTooltip
          content="Tooltip default position is 'Top'">
            <template #content>
              <AppButton
              label="Tooltip"
              variant="outlined"
              />
            </template>
          </AdaptoTooltip>
        </div>
      </div>
    </div>
     <!-- Variante de posición -->
     <div class="variant-section">
      <h2>Tooltip (position)</h2>
      <div class="variant-wrapper">
        <div class="flex">
          <AdaptoTooltip
          content="Tooltip Top"
          position="top">
            <template #content>
              <AppButton
              label="Top"
              variant="outlined"
              />
            </template>
          </AdaptoTooltip>
        </div>
        <div class="flex">
          <AdaptoTooltip
          content="Tooltip Bottom"
          position="bottom"
          >
            <template #content>
              <AppButton
              label="Bottom"
              variant="outlined"
              />
            </template>
          </AdaptoTooltip>
        </div>
        <div class="flex">
          <AdaptoTooltip
          content="Tooltip Left"
          position="left"
          >
            <template #content>
              <AppButton
              label="Left"
              variant="outlined"
              />
            </template>
          </AdaptoTooltip>
        </div>
        <div class="flex">
          <AdaptoTooltip
          content="Tooltip Right"
          position="right"
          >
            <template #content>
              <AppButton
              label="Right"
              variant="outlined"
              />
            </template>
          </AdaptoTooltip>
        </div>
      </div>
    </div>
    <!-- Variante de tooltip contenido largo -->
    <div class="variant-section">
      <h2>Tooltip contenido largo</h2>
      <div class="variant-wrapper">
        <div class="flex">
          <AdaptoTooltip
          :content="tooltipContent">
            <template #content>
              <AppButton
              label="Tooltip"
              variant="outlined"
              />
            </template>
          </AdaptoTooltip>
        </div>
      </div>
    </div>
    <!-- Variante de tooltip en cualquier elemento -->
    <div class="variant-section">
      <h2>Tooltip en cualquier elemento</h2>
      <div class="variant-wrapper">
        <div class="flex">
          <AdaptoTooltip
          :content="tooltipContent">
            <template #content>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat, iure quos, vitae qui reprehenderit quis necessitatibus ipsum distinctio in amet maxime. Quidem quasi sequi alias expedita beatae placeat itaque! Accusantium.</p>
            </template>
          </AdaptoTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
