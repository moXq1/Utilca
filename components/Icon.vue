<template>
  <component :is="icon" />
</template>

<script setup lang="ts">
type IconName =
  | "toast-error"
  | "toast-warning"
  | "toast-success"
  | "edit"
  | "trash";

const props = defineProps<{ name: IconName }>();

const icon = defineAsyncComponent(
  () => import(`@/assets/icons/${props.name}.svg`)
);
</script>
