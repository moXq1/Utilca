<template>
  <MiniModal
    ref="miniModalTarget"
    :submitHandler="
      () => {
        deleteAddress(currentAddress);
      }
    ">
    <template v-slot:question> Удалить? </template>
    <template v-slot:action>
      <button class="m-btn delete">Удалить</button>
    </template>
  </MiniModal>

  <AddrModal
    type="create"
    :userID="userId"
    :addressData="currentAddress"
    ref="cModalTarget"
    :handleRequest="createAddress"></AddrModal>
  <AddrModal
    type="update"
    :userID="userId"
    :addressData="currentAddress"
    ref="modalTarget"
    :handleRequest="updateAddress"></AddrModal>

  <main>
    <div v-if="!pending" class="container">
      <div class="item" v-for="add in addresses" :key="add.id">
        <Card :address="add" :updateHandler="edit" :deleteHandler="miniDel" />
      </div>

      <div class="item">
        <div
          class="pseudocard"
          @click="
            () => {
              cModalTarget?.show();
            }
          ">
          <h3>Новый адрес</h3>
        </div>
      </div>
    </div>

    <div v-if="pending"><Loader /></div>
  </main>

  <div>
    <!-- <NuxtLink >
      {{ add.name }}-{{ add.id }}</NuxtLink
    > -->
  </div>
</template>

<script setup lang="ts">
import AddrModal from "~/components/AddrModal.vue";
import {
  collection,
  deleteDoc,
  doc,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  ref as databaseRef,
  push,
  set,
  get,
  getDatabase,
  child,
} from "firebase/database";

import type MiniModal from "~/components/MiniModal.vue";

definePageMeta({
  middleware: ["auth"],
});

const { success, error } = useToast();

const user = useCurrentUser() || "";
if (!user.value) {
  throw new Error("User is not authenticated");
}
const userId = user.value.uid;
const db = useDatabase();

let addresses = ref<Address[]>([]);
let currentAddress = ref<Address>({} as Address);

let modalTarget = ref<InstanceType<typeof AddrModal>>();
let cModalTarget = ref<InstanceType<typeof AddrModal>>();
let miniModalTarget = ref<InstanceType<typeof MiniModal>>();

const {
  data,
  error: err,
  pending,
} = await useAsyncData<Address[]>(
  "addr",
  () => $fetch(`/api/address/${userId}`)
  // { server: false }
);

if (err.value) {
  console.log(err.value);
  error({ text: "Ошибка при получении адресов" });
  addresses.value = [];
} else {
  addresses.value = data.value ?? [];
}

async function edit(id: string) {
  const cur = addresses.value.find((addr) => addr.id === id);
  if (cur) {
    currentAddress.value.name = cur.name;
    currentAddress.value.id = cur.id;

    currentAddress.value.gasPrice = cur.gasPrice;
    currentAddress.value.waterPrice = cur.waterPrice;
    currentAddress.value.electricityPrice = cur.electricityPrice;
    currentAddress.value.internet = cur.internet;
    currentAddress.value.intercom = cur.intercom;
    currentAddress.value.gasRaspred = cur.gasRaspred;
    currentAddress.value.abonplata = cur.abonplata;
    currentAddress.value.garbage = cur.garbage;
    currentAddress.value.kvartplata = cur.kvartplata;
    // currentAddress.value = cur;
    modalTarget?.value?.show();
  }
}

async function miniDel(id: string) {
  const cur = addresses.value.find((addr) => addr.id === id);
  if (cur) {
    currentAddress.value.name = cur.name;
    currentAddress.value.id = cur.id;
    currentAddress.value.userID = userId;
    currentAddress.value.gasPrice = cur.gasPrice;
    currentAddress.value.waterPrice = cur.waterPrice;
    currentAddress.value.electricityPrice = cur.electricityPrice;
    currentAddress.value.internet = cur.internet;
    currentAddress.value.intercom = cur.intercom;
    currentAddress.value.gasRaspred = cur.gasRaspred;
    currentAddress.value.abonplata = cur.abonplata;
    currentAddress.value.garbage = cur.garbage;
    currentAddress.value.kvartplata = cur.kvartplata;
    // currentAddress.value = cur;
    miniModalTarget?.value?.showMini();
  }
}

async function createAddress(addr: Address) {
  try {
    const { data: address, error: err } = await useFetch("/api/address", {
      method: "post",
      body: addr,
    });

    if (err.value) {
      throw err.value;
    }

    success({ text: "Адрес добавлен" });

    addresses.value.push(address.value);
  } catch (e) {
    error({ text: "Ошибка при добавлении" });
    return e;
  }
}

async function updateAddress(addr: Address) {
  try {
    const { data: address, error: err } = await useFetch("/api/address", {
      method: "put",
      body: addr,
    });
    if (err.value) {
      throw err.value;
    }

    const addressIndex = addresses.value.findIndex(
      (curAddr) => addr.id === curAddr.id
    );

    success({ text: "Адрес Обновлен" });

    addresses.value[addressIndex] = addr;
  } catch (e) {
    error({ text: "Ошибка при обновлении" });
    return e;
  }
}

async function deleteAddress(addr: Address) {
  try {
    const { error } = await useFetch("/api/address", {
      method: "delete",
      body: addr,
    });
    if (error.value) {
      throw error.value;
    }

    const filteredAddr = addresses.value.filter(
      (curAddr) => addr.id !== curAddr.id
    );
    addresses.value = filteredAddr;

    success({ text: "Адрес Удален" });
  } catch (e) {
    error({ text: "Ошибка при удалении" });
    return e;
  }
}
</script>

<style scoped>
.pseudocard {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 2.5ch;
  padding-inline: 3ch;
  background-color: var(--surface-2);
  border-radius: 20px;
  height: 100%;
  /* max-width: min-content; */
  /* height: 170px; */
  /* align-self: center; */

  border: 2px solid var(--surface-3);
  transition: all 0.2s ease;
  justify-content: center;
  align-items: center;

  position: relative;
}

.pseudocard::before {
  position: absolute;
  content: "+";
  inset-inline-start: 0.3rem;
  inset-block-start: 0;
  font-size: 2.5rem;
  line-height: 1;
  transition: all 0.2s ease;
  font-weight: bold;
  color: inherit;
}
html.dark .pseudocard:hover::before {
  color: var(--primary);
}

.pseudocard:hover::before {
  color: var(--link-visited);
}

.pseudocard h3 {
  text-transform: capitalize;
  margin: 0;
  margin-block-end: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  text-wrap: pretty;
}

html.dark .pseudocard:hover {
  border-color: var(--primary);
}

html.dark .pseudocard:hover h3 {
  color: var(--primary);
  transition: all 0.2s ease;
}

.pseudocard:hover {
  border-color: var(--link-visited);
}

.pseudocard:hover h3 {
  color: var(--link-visited);
  transition: all 0.2s ease;
}

main {
  /* padding-inline: 32px;
  margin-inline: auto;
  max-width: 1100px;
  width: 100%;
  margin-block-start: 40px;
  min-height: 0;
  max-width: 65rem; */
}

.container {
  /* gap: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 25px;
  margin-block-start: 10px;
  padding-block: 2rem; */
  /* display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); */
}
/**mb better styles */

main {
  max-width: 65rem;
  margin-inline: max(50% - 65rem / 2, 1rem);
  margin-block: 6rem;
  container-type: inline-size;
}

.item {
  height: auto;
}

.container {
  --col-size: 125px;
  display: grid;

  gap: 1rem;

  grid-template-columns: repeat(auto-fit, minmax(var(--col-size), 1fr));

  @container (width >= calc(125px * 2 + 1rem)) {
    .item {
      grid-column: span 2;
    }
  }

  @container (calc(125px * 4 + 3rem) < width < calc(125px * 6 + 5rem) ) {
    .item:last-child:nth-child(odd) {
      grid-column: 2 / span 2;
    }
  }

  @container (calc(125px * 6 + 5rem) < width < calc(125px * 8 + 7rem)) {
    .item:nth-child(3n + 4):last-child {
      grid-column: 3 / 5;
    }

    &:has(:nth-child(3n + 5):last-child) > :nth-last-child(2) {
      grid-column: 2 / 4;
    }
  }

  @container (calc(125px * 8 + 7rem) < width < calc(125px * 10 + 9rem)) {
    .item:nth-child(4n + 5):last-child {
      grid-column: 4 / 6;
    }

    &:has(:nth-child(4n + 6):last-child) > :nth-last-child(2) {
      grid-column: 3 / 5;
    }

    &:has(:nth-child(4n + 7):last-child) > :nth-last-child(3) {
      grid-column: 2 / 4;
    }
  }
}
</style>
