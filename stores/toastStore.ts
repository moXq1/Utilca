import { defineStore } from "pinia";

export type ToastStatus = "success" | "warning" | "error";

interface Toast {
  text: string;
  status: ToastStatus;
  id: string;
}

type ToastPayload = { timeout?: number; text: string };

const defaultTimeout = 2000;

const createToast = (text: string, status: ToastStatus): Toast => ({
  text,
  status,
  id: crypto.randomUUID(),
});

export const useToast = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  const updateState = (payload: ToastPayload, status: ToastStatus) => {
    const { text, timeout } = payload;

    const toast = createToast(text, status);

    toasts.value.push(toast);

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toast.id);
    }, timeout || defaultTimeout);
  };

  const success = (payload: ToastPayload) => {
    updateState(payload, "success");
  };
  const warning = (payload: ToastPayload) => {
    updateState(payload, "warning");
  };
  const error = (payload: ToastPayload) => {
    updateState(payload, "error");
  };

  return { toasts, success, warning, error };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToast, import.meta.hot));
}
