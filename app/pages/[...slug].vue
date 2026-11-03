<script setup lang="ts">
import { useRoute, navigateTo } from '#app'

const route = useRoute()

// In development, allow Nuxt internal dev routes to pass through
if (!route.path.startsWith('/__nuxt_dev__')) {
  await navigateTo('/')
}
</script>

<template>
  <div />
</template>

