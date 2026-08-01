<script setup lang="ts">
import { ref } from 'vue';
import AdptCalendar from './lib/components/element/adpt-calendar/index.vue'
import AdptAvatar from './lib/components/element/adpt-avatar/index.vue'


const date = ref('2019-01-25')
</script>

<template>
<!-- <AdptCalendar/> -->
<AdptAvatar
image="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
size="lg"/>

<AdptAvatar
image="https://images.unsplash.com/photo-1654110455429-cf322b40a906?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
size="sm"
name="Jhonny Bravo"/>

<AdptAvatar
size="lg"
name="Jhonny Bravo"
showInitials
/>
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
