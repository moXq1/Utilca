<template>
  <div class="content">
    <h3>{{ formTitle }}</h3>
    <form @submit.prevent="auth">
      <Input
        :title="'Email'"
        :name="'email'"
        :key="'email'"
        class="color"
        autocomplete="off"
        :value="e"
        type="email"
        errMsg="Неверный email"
        :e="false"
        required
        minlength="3"
        maxlength="45" />

      <Input
        :title="'Пароль'"
        :key="'password'"
        :name="'password'"
        class="color"
        autocomplete="off"
        :value="p"
        type="password"
        errMsg="a-A-1-$, min-8 max-45"
        :e="false"
        required
        minlength="8"
        maxlength="45" />

      <!-- <label
        >Email

        <input v-model="email" type="email" name="" id="" />
      </label>
      <label>
        Password
        <input v-model="password" type="password" name="" id="" />
      </label> -->

      <button>{{ formTitle }}</button>
    </form>
    <p>
      {{ clickMsg }}
      <span class="switch" @click="authStateHandler">клик</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

definePageMeta({
  middleware: ["logged-in"],
});
const { success, error } = useToast();
let email = ref<string>("");
let e = computed(() => email);
let password = ref<string>("");
let p = computed(() => password);
const authF = useFirebaseAuth();

let isReg = ref<boolean>(true);

function authStateHandler() {
  isReg.value = !isReg.value;
}

async function auth() {
  try {
    if (isReg.value) {
      await createUserWithEmailAndPassword(authF!, email.value, password.value);
    } else {
      await signInWithEmailAndPassword(authF!, email.value, password.value);
    }

    await navigateTo("/", { replace: true });
  } catch (e) {
    console.log("Error while auth ", e);
    error({ text: "Неверный логин или пароль" });
  }
}

const clickMsg = computed(() => {
  return isReg.value ? "Уже есть аккаунт" : "Нет аккаунта";
});

const formTitle = computed(() => {
  return isReg.value ? "Регистрация" : "Войти";
});
</script>

<style scoped>
.switch {
  color: var(--link);
  transition: all 0.2s ease;

  &:hover {
    color: var(--link-visited);
    cursor: pointer;
  }
}
.content {
  margin-block-start: 40px;
  display: grid;
  padding: 0;
  border: none;
  max-inline-size: min(90vw, 80ch);
  max-block-size: min(80vh, 100%);
  max-block-size: min(80dvb, 100%);
  overflow: hidden;
  margin: auto;
  padding: 1rem;
  background: var(--surface-2);
  color: var(--text-1);
}

.yo {
  background-color: red;
}

form {
  margin-block: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

button {
  margin-block-start: 1rem;
  color: var(--link);
  transition: all 0.2s ease;
  &:hover {
    border-color: var(--link);
  }
}
</style>
