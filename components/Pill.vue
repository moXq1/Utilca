<template>
  <ul>
    <li>
      <p>Свет цена:</p>
      <span>{{ address.electricityPrice }}</span>
    </li>
    <li>
      <p>Вода цена:</p>
      <span>{{ address.waterPrice }}</span>
    </li>
    <li>
      <p>Газ цена:</p>
      <span>{{ address.gasPrice }}</span>
    </li>
    <li>
      <p>Распределение газ:</p>
      <span>{{ address.gasRaspred }}</span>
    </li>
    <li>
      <p>Мусор:</p>
      <span>{{ address.garbage }}</span>
    </li>
    <li>
      <p>Абонплата:</p>
      <span>{{ address.abonplata }}</span>
    </li>

    <li>
      <p>Домофон:</p>
      <span>{{ address.intercom }}</span>
    </li>
    <li>
      <p>Интернет:</p>
      <span>{{ address.internet }}</span>
    </li>
    <li>
      <p>Квартплата:</p>
      <span>{{ address.kvartplata }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { address } = defineProps<{ address: Address }>();
</script>

<style scoped>
/* div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--text-1);
  background-color: var(--surface-2);
} */

ul {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 0.5rem;
  padding: 5px 20px;
  background-color: var(--surface-1);
  border-radius: 2rem;
  font-weight: 500;
}
p {
  margin: 0;
}
</style>
