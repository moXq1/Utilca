<template>
  <div class="pad" :style="styles">
    <div class="container" :class="error || e ? 'error' : ''">
      <label :for="name">{{ title }}</label>
      <input
        @blur="blurHandler"
        @focus="focusHandler"
        placeholder=""
        :id="name"
        v-bind="$attrs"
        v-model="v" />
    </div>

    <span v-if="error" class="errorMsg">{{ errMsg || "Error" }}</span>
    <span v-if="e" class="errorMsg">{{
      "Текущие значение должно быть больше предыдущего"
    }}</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const { title, name, value, e, errMsg } = defineProps<{
  errMsg?: string;
  styles?: string;
  value: Ref<string> | Ref<number>;
  title: string;
  name: string;
  e?: boolean;
}>();

// const value = defineModel(`ni`);

const v = ref(value);

const error = ref(false);
const attrs = useAttrs();

//@ts-ignore
const { validate } = useValidate(attrs.type || "text");

function blurHandler() {
  error.value = validate(v.value);
}

function focusHandler() {
  error.value = false;
}
</script>

<style scoped>
.pad {
  padding-block-start: 1rem;
}
.container {
  font-size: 1rem;
  position: relative;
  width: 100%;
  height: 42px;
}
.container input {
  border: 1px solid var(--surface-2);
  border-radius: 5px;
  color: var(--text-2);
  cursor: auto;

  padding-block: 0.75ch;
  padding-inline: 1.75ch;
  line-height: 1.5;
  align-self: flex-start;
  background-color: var(--surface-2);
  font-size: initial;
  width: 100%;
  height: 100%;
}

input:disabled {
  background-color: var(--surface-4);
}

html.dark .container input {
  background-color: var(--surface-1);
}

html.dark input:disabled {
  background-color: var(--surface-3);
}

.container label {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  left: 1.75ch;
  transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  opacity: 0.8;
}

.error :is(input, label) {
  color: var(--red);
  border-color: var(--red);
}

.errorMsg {
  color: var(--red);
  opacity: 0;
  font-size: 0.8rem;
  animation: o 0.4s ease-out forwards;
}

input.color {
  background: var(--surface-1);
}

@keyframes o {
  to {
    opacity: 1;
  }
}

.container:has(input:focus-visible, input:not(:placeholder-shown)) label {
  top: 0%;
  transform: translateY(-100%);
  padding-block-end: 0.2rem;
  font-size: 0.8rem;
}
</style>
