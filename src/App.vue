<script setup lang="ts">
import AppButton from './lib/components/adpt-button/index.vue';
import AdaptoIcon from './lib/components/adpt-icon/index.vue';
</script>

<template>
  <h1>Aplicación Sandbox dentro de librería</h1>
<AppButton variant="soft" size="xs" :color="'green-100'" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="sm" color="primary-500" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="md" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="lg" @clicked="() => console.log('Botón clicado!')"/>
<AppButton variant="soft" size="xl" :icon="{name: 'alarm-clock'}" @clicked="() => console.log('Botón clicado!')"/>
</template>

<style scoped></style>
