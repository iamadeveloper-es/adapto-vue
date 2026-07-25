<script setup lang="ts">
import AppButton from './lib/components/element/adpt-button/index.vue';
import AdptAvatar from './lib/components/element/adpt-avatar/index.vue';
// const avatarData = {
//   group: [
//     {
//       name: 'Babco gonzalez gonzález',
//       image: './avatar.jpg',
//       display: 'name',
//       size: 'lg'
//     },
//     {
//       name: 'Daniel verdú',
//       image: './avatar.jpg',
//       display: 'name',
//       size: 'lg'
//     },
//     {
//       name: 'John',
//       image: './avatar.jpg',
//       display: 'name',
//       alt: 'John',
//       bgColor: 'secondary',
//       size: 'lg'
//     },
//     {
//       name: 'John Doe',
//       image: './avatar.jpg',
//       alt: 'Jhon',
//       size: 'lg'
//     },
//     {
//       name: 'John Doe',
//       image: './avatar.jpg',
//       alt: 'John',
//       size: 'lg'
//     },
//     {
//       name: 'John Doe',
//       image: './avatar.jpg',
//       alt: 'John',
//       size: 'lg'
//     }
//   ]
// };
</script>

<template>
  <AdptAvatar
    :image="'./avatar.jpg'"
    display="name"
    name="Daniel Verdu"
    size="xs"
  />
    <!-- <AdptAvatarGroup>
      <AdptAvatar
        v-for="(avatar, index) in avatarData.group"
        :key="index"
        v-bind="avatar"
      />
    </AdptAvatarGroup>
    <AdptAvatarGroup :max-count="4">
      <AdptAvatar
        v-for="(avatar, index) in avatarData.group"
        :key="index"
        v-bind="avatar"
      />
    </AdptAvatarGroup> -->
</template>

<style scoped></style>
