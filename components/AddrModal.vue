<template>
  <Modal ref="modalTarget" :submitHandler="handleSubmit">
    <template v-slot:title> Address </template>
    <div class="grid">
      <Input
        v-for="item in dataArr"
        :key="item.title"
        :title="item.title"
        :name="item.title"
        autocomplete="off"
        :value="item.value"
        :type="item.type"
        :errMsg="item.errMsg"
        required
        minlength="3"
        maxlength="35"
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
import Modal from "./Modal.vue";

let loading = ref(false);
let formError = ref(0);

const { type, addressData, userID, handleRequest } = defineProps<{
  addressData: Address;
  type: "create" | "update";
  userID: string;
  handleRequest: (addr: Address) => void;
}>();

function clear() {
  name.value = "";
  gasPrice.value = 0;
  waterPrice.value = 0;
  electricityPrice.value = 0;
  internet.value = 0;
  intercom.value = 0;
  gasRaspred.value = 0;
  abonplata.value = 0;
  garbage.value = 0;
  kvartplata.value = 0;
}

let name = ref(addressData?.name || "");
let gasPrice = ref(addressData?.gasPrice || 0);
let waterPrice = ref(addressData?.waterPrice || 0);
let electricityPrice = ref(addressData?.electricityPrice || 0);
let internet = ref(addressData?.internet || 0);
let intercom = ref(addressData?.intercom || 0);
let gasRaspred = ref(addressData?.gasRaspred || 0);
let abonplata = ref(addressData?.abonplata || 0);
let garbage = ref(addressData?.garbage || 0);
let kvartplata = ref(addressData?.kvartplata || 0);

let dataArr = computed(() => [
  {
    title: "Название",
    type: "text",
    value: name,
    errMsg: "длина мин 3",
  },
  {
    title: "Тариф газа",
    type: "number",
    value: gasPrice,
    errMsg: "Введите значение",
  },
  {
    title: "Распред. тариф",
    type: "number",
    value: gasRaspred,
    errMsg: "Введите значение",
  },
  {
    title: "Тариф воды",
    type: "number",
    value: waterPrice,
    errMsg: "Введите значение",
  },
  {
    title: "Абонплата",
    type: "number",
    value: abonplata,
    errMsg: "Введите значение",
  },
  {
    title: "Тариф элек.",
    type: "number",
    value: electricityPrice,
    errMsg: "Введите значение",
  },
  {
    title: "Квартплата",
    type: "number",
    value: kvartplata,
    errMsg: "Введите значение",
  },
  {
    title: "Мусор",
    type: "number",
    value: garbage,
    errMsg: "Введите значение",
  },
  {
    title: "Интернет",
    type: "number",
    value: internet,
    errMsg: "Введите значение",
  },
  {
    title: "Домофон",
    type: "number",
    value: intercom,
    errMsg: "Введите значение",
  },
]);

if (type === "update") {
  watch(addressData, () => {
    name.value = addressData.name;
    gasPrice.value = addressData.gasPrice;
    waterPrice.value = addressData.waterPrice;
    electricityPrice.value = addressData.electricityPrice;
    internet.value = addressData.internet;
    intercom.value = addressData.intercom;
    gasRaspred.value = addressData.gasRaspred;
    abonplata.value = addressData.abonplata;
    garbage.value = addressData.garbage;
    kvartplata.value = addressData.kvartplata;
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
    uuid = addressData.id;
    createdAt = addressData.createdAt;
  }

  const address: Address = {
    id: uuid,
    userID,
    name: name.value,
    gasPrice: gasPrice.value,
    waterPrice: waterPrice.value,
    electricityPrice: electricityPrice.value,
    internet: internet.value,
    intercom: intercom.value,
    gasRaspred: gasRaspred.value,
    abonplata: abonplata.value,
    garbage: garbage.value,
    kvartplata: kvartplata.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await handleRequest(address);
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
