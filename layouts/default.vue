<template>
  <header>
    <nav>
      <NuxtLink title="Главная страница" to="/" class="logo"></NuxtLink>

      <div class="b">
        <button
          aria-pressed="true"
          class="theme-toggle"
          title="цвет темы"
          @click="setTheme(darkMode ? 'light' : 'dark')">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6">
            <defs>
              <mask>
                <path
                  fill="black"
                  id="sun"
                  d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </mask>
            </defs>
            <path
              fill-rule="evenodd"
              d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
              clip-rule="evenodd" />
            <path
              d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        </button>
        <button v-if="!!user" @click="logout">Выйти</button>
      </div>
    </nav>
  </header>

  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";

const darkMode = useState("theme", () => false);
function setTheme(newTheme: string) {
  localStorage.setItem("theme", newTheme);
  darkMode.value = newTheme === "dark";
  document.documentElement.className = newTheme;
  document.documentElement.style.colorScheme = newTheme;
}

useHead({
  script: [
    {
      children: `if (localStorage.theme === "dark" || (!('theme' in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.className = "dark"
    } else {
      document.documentElement.className = "light"
    }`,
    },
  ],
});

onMounted(() => {
  const isDarkModePreferred = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const themeFromLocalStorage = localStorage.getItem("theme");
  if (themeFromLocalStorage) {
    setTheme(themeFromLocalStorage);
  } else {
    setTheme(isDarkModePreferred ? "dark" : "light");
  }
});

watch(darkMode, (selected) => {
  setTheme(selected ? "dark" : "light");
});

const user = useCurrentUser() || "";
const auth = useFirebaseAuth();
async function logout() {
  if (!auth) {
    return;
  }
  await signOut(auth);
  await navigateTo("/register", { replace: true });
}
</script>

<style scoped>
.router-link-exact-active {
  color: var(--primary);
}

.logo {
  width: 40px;
  height: 40px;
  filter: contrast(130%) brightness(1500%);
  background: linear-gradient(145deg, rgba(6, 0, 255, 1), rgba(206, 55, 162, 0)),
    linear-gradient(318deg, rgba(44, 0, 255, 1), rgba(255, 0, 0, 0)),
    url(/assets/icons/grain.svg);

  border-radius: 50%;
  --hg-size: 0;
  box-shadow: var(--shadow), 0 0 0 var(--hg-size) var(--highlight);
  transition: all 0.3s ease;
}

.theme-toggle {
  width: 48px;
  aspect-ratio: 1;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  display: grid;
  place-items: center;
  padding: 0;

  & svg {
    width: 55%;
    fill: currentColor;
  }
}

.logo:hover {
  scale: 1.1;
  --hg-size: 0.5rem;
}

header {
  padding-block: 1rem;
  padding-inline: 32px;
  background: color-mix(in srgb, var(--surface-4) 80%, transparent);
  margin-block-end: 40px;
  border-radius: 0.75rem;
  margin-inline: auto;
  max-width: 1100px;
  width: 100%;
  min-height: 0;
  backdrop-filter: blur(15px);
}

html.dark header {
  background: color-mix(in srgb, var(--surface-2) 80%, transparent);
}

html.dark .theme-toggle path:first-of-type,
.theme-toggle path:last-of-type {
  display: block;
}

html.dark .theme-toggle path:last-of-type,
.theme-toggle path:first-of-type {
  display: none;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.b {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
