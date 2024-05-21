<template>
  <dialog @click="closeFromEvent" ref="dialogRef">
    <form @submit="submitHandler" method="dialog">
      <article>
        <slot name="question">
          <p>Are you sure ?</p>
        </slot>
      </article>
      <footer>
        <menu>
          <button autofocus type="reset" @click="close">Отменить</button>
          <slot name="action"></slot>
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

defineExpose({ showMini: showModal, visibleMini: visible, closeMini: close });
</script>

<style scoped>
:slotted(.delete) {
  background-color: var(--surface-1);

  border-color: var(--surface-3);
  color: var(--link);
}

:slotted(.delete):hover {
  border-color: inherit;
}

dialog {
  display: grid;
  padding: 0;
  border: none;
  max-inline-size: min(90vw, 60ch);

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
  width: min(60ch, 90vw);
}

dialog > form > article {
  overflow-y: auto;
  max-block-size: 100%; /* safari */
  overscroll-behavior-y: contain;
  display: grid;
  padding-inline: 1.5rem;
  padding-block: 1rem;
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
  justify-content: flex-end;
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
</style>
