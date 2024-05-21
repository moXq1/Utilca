<template>
  <Modal ref="modalTarget" :submitHandler="handleSubmit">
    <template v-slot:title> Tarif </template>
    <div class="grid col-4">
      <Input
        v-for="item in dataArr"
        :key="item.title"
        :title="item.title"
        :name="item.title"
        autocomplete="off"
        :value="item.value"
        :type="item.type"
        :errMsg="item.errMsg"
        :disabled="item.disabled"
        :e="item.e || false"
        required
        minlength="3"
        maxlength="25"
        step="0.01"
        min="0" />
    </div>

    <template v-slot:clear>
      <button class="m-btn clear" type="button" @click="clear">Очистить</button>
    </template>
    <template v-slot:actions
      ><button class="m-btn cancel" type="button" @click="close">Отмена</button>
      <button :disabled="formError > 0" class="m-btn add">Добавить</button>
    </template>
    <span v-if="loading">Loading</span>
  </Modal>
</template>

<script setup lang="ts">
//@ts-ignore
import toFixed from "~/server/utils/toFixed";
import Modal from "./Modal.vue";

let loading = ref(false);
let formError = ref(0);

const { type, tarifData, address, addressID, userID, handleRequest } =
  defineProps<{
    tarifData: Tarif;
    type: "create" | "update";
    userID: string;
    addressID: string;
    address: Address;
    handleRequest: (addr: Tarif) => void;
  }>();

function clear() {
  curElec.value = 0;
  curGas.value = 0;
  curWater.value = 0;
  prevElec.value = 0;
  prevGas.value = 0;
  prevWater.value = 0;
  heating.value = 0;
}

let curElec = ref(tarifData?.currElec || 0);
let heating = ref(tarifData?.heating || address.heating || 0);
let curGas = ref(tarifData?.currGas || 0);
let curWater = ref(tarifData?.currWater || 0);
let prevElec = ref(tarifData?.prevElec || 0);
let prevGas = ref(tarifData?.prevGas || 0);
let prevWater = ref(tarifData?.prevWater || 0);
let distinctionElec = computed(() =>
  +curElec.value - +prevElec.value > 0
    ? toFixed(+curElec.value - +prevElec.value)
    : 0
);
let distinctionGas = computed(() =>
  +curGas.value - +prevGas.value > 0
    ? toFixed(+curGas.value - +prevGas.value)
    : 0
);
let distinctionWater = computed(() =>
  +curWater.value - +prevWater.value > 0
    ? toFixed(+curWater.value - +prevWater.value)
    : 0
);

let totalElec = computed(() =>
  toFixed(+address.electricityPrice * +distinctionElec.value)
);

let totalGas = computed(() =>
  toFixed(+address.gasPrice * +distinctionGas.value)
);
let totalWater = computed(() =>
  toFixed(+address.waterPrice * +distinctionWater.value)
);
let total = computed(() =>
  toFixed(
    +heating.value +
      +totalElec.value +
      +totalGas.value +
      +totalWater.value +
      +address.abonplata +
      +address.garbage +
      +address.gasRaspred +
      +address.intercom +
      +address.internet +
      +address.kvartplata
  )
);

let dataArr = computed(() => [
  {
    title: "Текущие Элек.",
    type: "number",
    value: curElec,
    errMsg: "Введите значение",
  },
  {
    title: "Предыдущие Элек.",
    type: "number",
    value: prevElec,
    errMsg: "Введите значение",
  },
  {
    title: "Разница Элек.",
    type: "number",
    value: distinctionElec,
    errMsg: "Введите значение",
    disabled: true,
    e: curElec.value < prevElec.value,
  },
  {
    title: "Всего Элек.",
    type: "number",
    value: totalElec,
    errMsg: "Введите значение",
    disabled: true,
  },
  {
    title: "Текущие Воды",
    type: "number",
    value: curWater,
    errMsg: "Введите значение",
  },
  {
    title: "Предыдущие Воды",
    type: "number",
    value: prevWater,
    errMsg: "Введите значение",
  },
  {
    title: "Разница Воды",
    type: "number",
    value: distinctionWater,
    errMsg: "Введите значение",
    disabled: true,
    e: curWater.value < prevWater.value,
  },
  {
    title: "Всего Воды",
    type: "number",
    value: totalWater,
    errMsg: "Введите значение",
    disabled: true,
  },
  {
    title: "Текущие Газ",
    type: "number",
    value: curGas,
    errMsg: "Введите значение",
  },
  {
    title: "Предыдущие Газ",
    type: "number",
    value: prevGas,
    errMsg: "Введите значение",
  },
  {
    title: "Разница Газ",
    type: "number",
    value: distinctionGas,
    errMsg: "Введите значение",
    disabled: true,
    e: curGas.value < prevGas.value,
  },
  {
    title: "Всего Газ",
    type: "number",
    value: totalGas,
    errMsg: "Введите значение",
    disabled: true,
  },
  {
    title: "Отопление",
    type: "number",
    value: heating,
    errMsg: "Введите значение",
  },
  {
    title: "Стоимость всего",
    type: "number",
    value: total,
    errMsg: "Введите значение",
    disabled: true,
  },
]);

if (type === "update") {
  watch(tarifData, () => {
    curElec.value = tarifData.currElec;
    curGas.value = tarifData.currGas;
    curWater.value = tarifData.currWater;
    prevElec.value = tarifData.prevElec;
    prevGas.value = tarifData.prevGas;
    prevWater.value = tarifData.prevWater;

    heating.value = tarifData.heating || address.heating || 0;
  });
}

async function handleSubmit() {
  loading.value = true;
  let uuid;
  let createdAt;

  if (type === "create") {
    uuid = crypto.randomUUID();
    createdAt = new Date().toISOString();
  } else {
    uuid = tarifData.id;
    createdAt = tarifData.createdAt;
  }

  const tarif: Tarif = {
    id: uuid,
    addressID,
    userID,
    currElec: curElec.value,
    currGas: curGas.value,
    currWater: curWater.value,
    distinctionElec: distinctionElec.value,
    distinctionGas: distinctionGas.value,
    distinctionWater: distinctionWater.value,
    prevElec: prevElec.value,
    prevGas: prevGas.value,
    prevWater: prevWater.value,
    totalElec: totalElec.value,
    totalGas: totalGas.value,
    totalWater: totalWater.value,
    total: total.value,
    heating: heating.value,
    createdAt,
    updatedAt: new Date().toISOString(),
  };

  await handleRequest(tarif);
  loading.value = false;
}

function show() {
  modalTarget?.value?.show();
}

function close() {
  modalTarget?.value?.close();
}

let modalTarget = ref<InstanceType<typeof Modal>>();

defineExpose({ show });
</script>

<style scoped></style>
