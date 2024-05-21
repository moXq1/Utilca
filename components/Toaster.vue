<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toasts.length > 0" class="toaster__wrapper">
        <TransitionGroup name="toast" tag="ul">
          <li
            v-for="toast in toasts"
            :key="toast.text + Math.random()"
            :class="['toaster__inner', toastColorMap[toast.status]]">
            <Icon
              :name="toastIconMap[toast.status]"
              class="toaster__inner-icon" />
            <span class="toaster__inner-text">{{ toast.text }}</span>
          </li>
        </TransitionGroup>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts } = storeToRefs(useToast());

const toastColorMap: Record<ToastStatus, string> = {
  warning: "warning",
  error: "error",
  success: "success",
};

const toastIconMap: Record<
  ToastStatus,
  "toast-error" | "toast-warning" | "toast-success"
> = {
  error: "toast-error",
  warning: "toast-warning",
  success: "toast-success",
};
</script>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  scale: 0.6;
  opacity: 0;
}
.toast-enter-active {
  transition: 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) all;
}
.toast-leave-active {
  transition: 0.4s cubic-bezier(0.06, 0.71, 0.55, 1) all;
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  scale: 1;
  transform: translateX(0);
}

.toaster__wrapper {
  position: fixed;

  bottom: 3%;
  right: 5%;

  z-index: 100;
}

.toaster__wrapper ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toaster__inner {
  --color: #363636;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  line-height: 1.3;
  border-radius: 0.3rem;
  transition: all 230ms cubic-bezier(0.21, 1.02, 0.73, 1);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;

  background-color: white;
  border-radius: 8px;
  padding: 8px 10px;
  pointer-events: auto;
  color: var(--color);
}

.toaster__inner-icon {
  width: 1.8rem;
  aspect-ratio: 1/1;
}

.toaster__inner-text {
  font-size: 1.1rem;
  font-weight: 500;
  white-space: pre-line;
}
</style>
