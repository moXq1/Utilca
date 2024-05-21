<template>
  <dialog @click="closeFromEvent" ref="dialogRef">
    <form @submit="submitHandler" method="dialog" v-if="visible">
      <header>
        <section class="headline">
          <h3><slot name="title"></slot></h3>
        </section>
        <button type="button" @click="close">
          <title>close dialog</title>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <article>
        <slot></slot>
      </article>

      <footer>
        <menu> <slot name="clear"></slot></menu>
        <menu>
          <slot name="actions"></slot>
        </menu>
      </footer>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const { submitHandler } = defineProps<{ submitHandler?: () => void }>();

const dialogRef = ref<HTMLDialogElement>();
const visible = ref(false);
const showModal = () => {
  window.addEventListener("popstate", closeModal);
  window.history.pushState({ isOpen: true }, "ttt");
  dialogRef.value?.showModal();
  visible.value = true;
};

function close() {
  if (window.history.state.isOpen) {
    window.history.back();
  }
}

function closeModal() {
  dialogRef.value?.close();
  visible.value = false;

  window.removeEventListener("popstate", closeModal);
}

function closeFromEvent(e: MouseEvent) {
  const modalRect = dialogRef.value!.getBoundingClientRect();

  if (
    e.clientX < modalRect?.left ||
    e.clientX > modalRect.right ||
    e.clientY < modalRect.top ||
    e.clientY > modalRect.bottom
  ) {
    close();
  }
}

defineExpose({ show: showModal, visible, close });
</script>

<style scoped>
:slotted(.grid) > *:has(input[type="text"]) {
  grid-column: 1 / -1;
}

:slotted(.grid) {
  display: grid;

  inline-size: 100%;
  max-inline-size: min(90vw, 80ch);
  max-block-size: min(80vh, 100%);
  max-block-size: min(80dvb, 100%);
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

:slotted(.container) {
  display: inline-flex;
  gap: 1rem;
  align-items: center;
  font-size: 1rem;
  justify-content: space-between;
}

:slotted(.container input) {
  border: 1px solid var(--surface-2);
  border-radius: 5px;
  color: var(--text-2);
  cursor: auto;

  padding-block: 0.75ch;
  padding-inline: 1.75ch;

  align-self: flex-start;
  /* background-color: var(--surface-2); */
  font-size: initial;
}

:slotted(.container input[type="number"]) {
  flex-shrink: 1;
  /* flex-grow: 1; */
  /* width: min(100%, 9ch); */

  width: clamp(9ch, 14cqw, 20ch);
}

:slotted(.container input[type="text"]) {
  flex: 1;
}

/* :slotted(.container label) {
} */

:slotted(.container:has(input[type="text"])) {
  grid-column: 1 / -1;
}

/* :slotted(.m-btn):hover {
  --hg-size: 0.5rem;
} */

/* :slotted(.cancel) {
} */

:slotted(.clear) {
  background-color: var(--surface-1);

  border-color: #ffc9c9;
  color: var(--red);
  /* border:#ffc9c9 color:red*/
}

html.dark :slotted(.clear) {
  color: #ffc9c9;
  border-color: var(--surface-3);
}

:slotted(.add) {
  background-color: var(--surface-1);

  border-color: var(--surface-3);
  color: var(--link);
}

:slotted(.add):hover,
:slotted(.clear):hover {
  border-color: inherit !important;
}

dialog {
  display: grid;
  padding: 0;
  border: none;
  max-inline-size: min(90vw, 80ch);
  max-block-size: min(80vh, 100%);
  max-block-size: min(80dvb, 100%);
  overflow: hidden;
  margin: auto;
  padding: 0;
  position: fixed;
  inset: 0;
  z-index: 10;
  background: var(--surface-2);
  color: var(--text-1);
}
dialog:not([open]) {
  pointer-events: none;
  opacity: 0;
}

dialog::backdrop {
  backdrop-filter: blur(25px);
  transition: backdrop-filter 0.5s ease;
}
html:has(dialog[open]) {
  overflow: hidden;
}
dialog > form {
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-items: start;
  max-block-size: 80vh;
  max-block-size: 80dvb;
  width: min(80ch, 90vw);
}

dialog:has(form:invalid) :slotted(.add) {
  pointer-events: none;
  background-color: var(--surface-3);
}

dialog > form > header {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--surface-2);
  padding-block: 1rem;
  padding-inline: 1.5rem;
}

html.dark dialog > form > header {
  background: var(--surface-1);
}

dialog > form > header > button {
  border-radius: 50%;
  padding: 0.75ch;
  aspect-ratio: 1;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
  margin: 0;
  border: none;
  transition: 0.2s ease all;
  --hg-size: 0;

  box-shadow: 0 0 0 var(--hg-size) var(--highlight);

  &:hover {
    scale: 1.1;
    --hg-size: 0.5rem;
  }
}

h3 {
  max-inline-size: 35ch;
  font-size: 2rem;
  line-height: 1.25;
  margin: 0;
}

svg {
  inline-size: 2ch;
  block-size: 2ch;
  flex-shrink: 0;
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-width: 3px;
  stroke-linejoin: round;
}

dialog > form > article {
  overflow-y: auto;
  max-block-size: 100%; /* safari */
  overscroll-behavior-y: contain;
  display: grid;
  padding-inline: 1.5rem;
  padding-block: 1rem;

  /* overflow-y: auto; */
  /*
  max-block-size: 100%;

  display: grid;

  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  padding-inline: 1.5rem;
  padding-block: 1rem; */
}

dialog > form > article {
  background: var(--surface-1);
}

html.dark dialog > form > article {
  background: inherit;
}

dialog > form > footer {
  background: var(--surface-2);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  padding-inline: 1.5rem;
  padding-block: 1rem;
}

html.dark dialog > form > footer {
  background: var(--surface-1);
}

dialog > form > footer > menu {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-inline-start: 0;
  margin: 0;
}

dialog > form > footer > menu:only-child {
  margin-inline-start: auto;
}

@media (max-width: 500px) {
  :slotted(.container) {
    flex-direction: column;
    align-items: flex-start;
  }

  :slotted(.container input),
  :slotted(.container input[type="number"]) {
    width: 100%;
  }

  dialog {
    inline-size: 100vw;
    max-width: 100vw;
    top: 100%;
    transform: translateY(-50%);
  }

  dialog > form {
    width: 100%;
  }
  /* footer {
  } */

  menu {
    flex-shrink: 0;
    flex-grow: 1;
  }

  :slotted(.m-btn) {
    flex-shrink: 0;
    flex-grow: 1;
  }

  /* menu,
  :slotted(.m-btn) {
    width: auto;
  }
 */
}
</style>
