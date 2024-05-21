<template>
  <main>
    <!-- {{ address }} -->
    <div v-if="address">
      <MiniModal
        ref="miniModalTarget"
        :submitHandler="
          () => {
            deleteTarif(currentTarif);
          }
        ">
        <template v-slot:question> Удалить? </template>
        <template v-slot:action>
          <button class="m-btn delete">Удалить</button>
        </template>
      </MiniModal>
      <TarifModal
        type="create"
        ref="cModalTarget"
        :userID="userId"
        :addressID="id"
        :address="address"
        :tarifData="currentTarif"
        :handleRequest="createTarif"></TarifModal>
      <TarifModal
        type="update"
        ref="modalTarget"
        :userID="userId"
        :addressID="id"
        :address="address"
        :tarifData="currentTarif"
        :handleRequest="updateTarif"></TarifModal>
    </div>

    <div class="table-container">
      <div v-if="pending || tarifPed"><Loader /></div>
      <table v-if="!pending && !tarifPed">
        <caption>
          <h2>{{ address?.name }}</h2>
        </caption>
        <thead class="new-head">
          <tr>
            <td colspan="8">
              <button
                class="new-tarif"
                @click="
                  () => {
                    cModalTarget?.show();
                  }
                ">
                + новый тариф
              </button>
            </td>
          </tr>
        </thead>
        <thead v-if="tarifs.length > 0">
          <tr>
            <!-- <td colspan="1"></td> -->
            <th scope="rowgroup"></th>
            <th></th>
            <th scope="col">вода</th>
            <th scope="col">свет</th>
            <th scope="col">газ</th>
            <th scope="col">отопление</th>
            <th scope="col">Сумма</th>
            <th></th>
          </tr>
        </thead>
        <transition-group name="mv">
          <tbody
            @click="
              () => {
                if (openedRows[t.id]) {
                  delete openedRows[t.id];
                  return;
                }
                openedRows[t.id] = true;
              }
            "
            v-for="t in tarifs"
            :key="t.id">
            <tr>
              <td rowspan="4" scope="rowgroup">
                <div class="beh" :class="openedRows[t.id] ? 'open' : ''">
                  {{ dataFormat(t.createdAt as string) }}
                </div>
              </td>

              <th scope="row">всего</th>
              <td>{{ t.totalWater }}</td>
              <td>{{ t.totalElec }}</td>
              <td>{{ t.totalGas }}</td>
              <td rowspan="4">{{ t.heating || address?.heating || 0 }}</td>
              <td rowspan="4">{{ t.total }}</td>
              <td rowspan="4">
                <div class="action-btns">
                  <button
                    @click="edit(t.id)"
                    class="action-update"
                    title="обновить тариф">
                    <Icon :name="'edit'" class="update-icon" />
                  </button>
                  <button
                    @click="minidel(t.id)"
                    class="action-delete"
                    title="удалить тариф">
                    <Icon :name="'trash'" class="delete-icon" />
                  </button>
                </div>
              </td>
            </tr>
            <transition-group name="scale">
              <tr v-if="openedRows[t.id]">
                <th scope="row">текущие</th>
                <td>{{ t.currWater }}</td>
                <td>{{ t.currElec }}</td>
                <td>{{ t.currGas }}</td>
              </tr>

              <tr v-if="openedRows[t.id]">
                <th scope="row">Предыдущие</th>
                <td>{{ t.prevWater }}</td>
                <td>{{ t.prevElec }}</td>
                <td>{{ t.prevGas }}</td>
              </tr>

              <tr v-if="openedRows[t.id]">
                <th scope="row">разница</th>
                <td>{{ t.distinctionWater }}</td>
                <td>{{ t.distinctionElec }}</td>
                <td>{{ t.distinctionGas }}</td>
              </tr>
            </transition-group>
          </tbody>
        </transition-group>
        <tfoot v-if="isPrevPage || isNextPage">
          <tr>
            <td colspan="8">
              <div class="btns">
                <button v-if="isPrevPage" @click.stop.prevent="prevData">
                  &#10094;
                </button>
                <button v-if="isNextPage" @click.stop.prevent="nextData">
                  &#10095;
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import type MiniModal from "~/components/MiniModal.vue";
import type TarifModal from "~/components/TarifModal.vue";
import dataFormat from "~/server/utils/dataFormat";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const id = route.params.id as string;

let openedRows = ref<{ [key: string]: boolean }>({});

let tarifs = ref<Tarif[]>([]);
let currentTarif = ref<Tarif>({} as Tarif);

async function edit(id: string) {
  const cur = tarifs.value.find((t) => t.id === id);
  if (cur) {
    currentTarif.value.id = cur.id;
    currentTarif.value.addressID = cur.addressID;
    currentTarif.value.currElec = cur.currElec;
    currentTarif.value.currGas = cur.currGas;
    currentTarif.value.currWater = cur.currWater;
    currentTarif.value.prevElec = cur.prevElec;
    currentTarif.value.prevGas = cur.prevGas;
    currentTarif.value.prevWater = cur.prevWater;
    currentTarif.value.distinctionElec = cur.distinctionElec;
    currentTarif.value.distinctionGas = cur.distinctionGas;
    currentTarif.value.distinctionWater = cur.distinctionWater;
    currentTarif.value.totalElec = cur.totalElec;
    currentTarif.value.totalGas = cur.totalGas;
    currentTarif.value.totalWater = cur.totalWater;
    currentTarif.value.heating = cur.heating || address?.value?.heating || 0;
    currentTarif.value.total = cur.total;
    currentTarif.value.userID = cur.userID;
    currentTarif.value.createdAt = cur.createdAt;
    // currentAddress.value = cur;
    modalTarget?.value?.show();
  }
}

function minidel(id: string) {
  const cur = tarifs.value.find((t) => t.id === id);
  if (cur) {
    currentTarif.value.id = cur.id;
    currentTarif.value.addressID = cur.addressID;
    currentTarif.value.currElec = cur.currElec;
    currentTarif.value.currGas = cur.currGas;
    currentTarif.value.currWater = cur.currWater;
    currentTarif.value.prevElec = cur.prevElec;
    currentTarif.value.prevGas = cur.prevGas;
    currentTarif.value.prevWater = cur.prevWater;
    currentTarif.value.distinctionElec = cur.distinctionElec;
    currentTarif.value.distinctionGas = cur.distinctionGas;
    currentTarif.value.distinctionWater = cur.distinctionWater;
    currentTarif.value.totalElec = cur.totalElec;
    currentTarif.value.totalGas = cur.totalGas;
    currentTarif.value.totalWater = cur.totalWater;
    currentTarif.value.heating = cur.heating;
    currentTarif.value.total = cur.total;
    currentTarif.value.userID = cur.userID;
    currentTarif.value.createdAt = cur.createdAt;
    // currentAddress.value = cur;
    miniModalTarget?.value?.showMini();
  }
}

const { success, error } = useToast();

const user = useCurrentUser() || "";
if (!user.value) {
  throw new Error("User is not authenticated");
}
const userId = user.value.uid;

const {
  data: address,
  error: err,
  pending,
} = await useAsyncData<Address>(
  "address",
  () => $fetch(`/api/address/${userId}/${id}`)
  // { server: false }
);

let cModalTarget = ref<InstanceType<typeof TarifModal>>();
let modalTarget = ref<InstanceType<typeof TarifModal>>();
let miniModalTarget = ref<InstanceType<typeof MiniModal>>();

const {
  data: tarifData,
  error: tarifError,
  lazyFetch,
  nextPageData,
  pending: tarifPed,
  isNextPage,
  isPrevPage,
  prevPageData,
} = usePagData(`/api/tarif/${userId}/${id}`, 12);

// if (tarifError) {
//   error({ text: "Ошибка при получении тарифов" });
// }

try {
  await lazyFetch();
  tarifs.value = tarifData.value;
} catch (e) {
  error({ text: "Ошибка при получении тарифов" });
}

async function nextData() {
  try {
    await nextPageData();
    tarifs.value = tarifData.value;
  } catch (e) {
    error({ text: "Ошибка при получении тарифов" });
  }
}

async function prevData() {
  try {
    await prevPageData();
    tarifs.value = tarifData.value;
  } catch (e) {
    error({ text: "Ошибка при получении тарифов" });
  }
}

async function createTarif(tarif: Tarif) {
  try {
    const { data: t, error: err } = await useFetch(
      `/api/tarif/${tarif.userID}/${tarif.addressID}`,
      {
        method: "post",
        body: tarif,
      }
    );

    if (err.value) {
      throw err.value;
    }

    success({ text: "Тариф добавлен" });

    tarifs.value.push(t.value);
  } catch (e) {
    error({ text: "Ошибка при добавлении" });
    return e;
  }
}

async function updateTarif(tarif: Tarif) {
  try {
    const { data: t, error: err } = await useFetch(
      `/api/tarif/${tarif.userID}/${tarif.addressID}`,
      {
        method: "put",
        body: tarif,
      }
    );
    if (err.value) {
      throw err.value;
    }

    const tarifIndex = tarifs.value.findIndex((curT) => tarif.id === curT.id);

    success({ text: "Тариф Обновлен" });

    tarifs.value[tarifIndex] = tarif;
  } catch (e) {
    error({ text: "Ошибка при обновлении" });
    return e;
  }
}

async function deleteTarif(tarif: Tarif) {
  try {
    const { data: t, error } = await useFetch(
      `/api/tarif/${tarif.userID}/${tarif.addressID}`,
      {
        method: "delete",
        body: tarif,
      }
    );
    if (error.value) {
      throw error.value;
    }

    const filteredAddr = tarifs.value.filter((t) => tarif.id !== t.id);
    tarifs.value = filteredAddr;

    success({ text: "Адрес Удален" });
  } catch (e) {
    error({ text: "Ошибка при удалении" });
    return e;
  }
}
</script>

<style scoped>
.scale-enter-active {
  transition: all 0.3s ease;
}

.scale-leave-active {
  /* transition: all 0.3s ease; */
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;

  transform: translateX(-30px);
}

.mv-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mv-leave-active {
  /* transition: all 0.1s ease; */
}

.mv-enter-from,
.mv-leave-to {
  opacity: 0;
  /* display: none; */
  /* background-color: red; */
  transform: translateY(-100px);
}

.beh {
  display: flex;
  gap: 1rem;
  width: 110px;
  align-items: start;
}

.action-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-btns > * {
  min-width: fit-content;
  flex: 1;
}
.action-delete {
  background-color: var(--surface-1);

  border-color: #ffc9c9;
  color: var(--red);

  & :is(svg, line, path) {
    stroke: var(--red);
  }
  /* border:#ffc9c9 color:red*/
}

html.dark .action-delete {
  color: #ffc9c9;
  border-color: var(--surface-3);

  & :is(svg, line, path) {
    /* fill: var(--red); */
    stroke: #ffc9c9;
  }
}

.new-head {
  & td {
    /* padding: 0; */
    /* border-color: transparent;
    border-bottom-color: white; */
  }
}

.new-tarif {
  width: 100%;
}
.new-tarif:hover {
  border-color: var(--link);
}

.collapse,
.btns > *,
.action-update,
.new-tarif,
.new-head {
  background-color: var(--surface-1);

  border-color: var(--surface-3);
  color: var(--link);

  & :is(svg, line, path) {
    stroke: var(--link);
  }
}

.collapse,
.btns > *:hover,
.action-update:hover,
.action-delete:hover {
  border-color: inherit !important;
}
main {
  padding-inline: 32px;
  margin-inline: auto;
  max-width: 1100px;
  width: 100%;
  margin-block-start: 40px;
  min-height: 0;
}

table {
  border: 1px solid white;
  border-collapse: collapse;
  width: 100%;

  /* table-layout: auto; */
}

tfoot {
  padding-inline: 0.5rem;
  width: 100%;
}

.btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btns > * {
  min-width: fit-content;
  /* flex: 1; */
}

td[scope="rowgroup"],
th[scope="rowgroup"] {
  word-wrap: break-word;
  white-space: wrap;
  text-wrap: pretty;
  vertical-align: initial;
  text-align: initial;
  margin: 0;
}

td[scope="rowgroup"] {
  position: relative;
}

tbody:hover td[scope="rowgroup"]::after {
  color: var(--link);
}

tbody:has(.open) td[scope="rowgroup"]::after {
  transform: rotate(180deg);
}

td[scope="rowgroup"]::after {
  transition: all 0.2s ease;
  position: absolute;
  content: "\25BC";
  top: 0px;
  right: 5px;
}
th {
  background-color: var(--surface-2);
  /* max-width: 0; */

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td,
th {
  border: 1px solid var(--surface-2);
  padding: 0.5rem 0.75rem;
  /* vertical-align: middle; */
  text-align: left;
  width: min-content;
  text-transform: capitalize;
  font-size: 1rem;
}

th {
  border: 1px solid var(--surface-1);
}

th[scope="row"] {
  text-align: start;
  min-width: 75px;
  width: min-content;
}

.table-container {
  overflow-x: auto;
}

@media (min-width: 768px) {
  .table-container button {
    display: inline-block;
    margin: 0;
  }
}
</style>
