<template>
  <NuxtLink external :to="`address/${address.id}`">
    <h3 :title="address.name">{{ address.name }}</h3>
    <div class="btns">
      <button class="update" @click.stop.prevent="updateHandler(address.id)">
        Обновить
      </button>
      <button @click.stop.prevent="deleteHandler(address.id)" class="delete">
        Удалить
      </button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { address } = defineProps<{
  address: Address;
  updateHandler: (id: string) => void;
  deleteHandler: (id: string) => void;
}>();
</script>

<style scoped>
a {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 2.5ch;
  padding-inline: 3ch;
  background-color: var(--surface-2);
  border-radius: 20px;
  text-decoration: none;
  /* width: calc(31% + 3px); */
  /* min-width: 250px; */
  flex: 1;
  border: 2px solid var(--surface-3);
  transition: all 0.2s ease;

  /* overflow: hidden;
  text-overflow: ellipsis; */
}

/* a:has(.btns:hover) {
  background-color: red;
} */
a:hover {
  border-color: var(--link-visited);
}

a:not(:has(.btns:hover)):hover h3 {
  color: var(--link-visited);
  transition: all 0.2s ease;
}

.delete {
  background-color: var(--surface-1);

  border-color: #ffc9c9;
  color: var(--red);
  /* border:#ffc9c9 color:red*/
}

html.dark .delete {
  color: #ffc9c9;
  border-color: var(--surface-3);
}

html.dark a:hover {
  border-color: var(--primary);
}

html.dark a:not(:has(.btns:hover)):hover h3 {
  color: var(--primary);
  transition: all 0.2s ease;
}

h3 {
  font-size: 1.7rem;
  text-transform: capitalize;
  margin: 0;
  margin-block-end: 1.5rem;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.btns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btns > * {
  min-width: fit-content;
  flex: 1;
}

.update {
  background-color: var(--surface-1);
  border-color: var(--surface-3);
  color: var(--link);
}

.update:hover,
.delete:hover {
  border-color: inherit !important;
}
</style>
