<template>
  <div>
    <Toaster />
    <NuxtLayout> <NuxtPage /></NuxtLayout>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const user = useCurrentUser();

useHead({
  title: "tarifCost",
  meta: [{ name: "description", content: "Следите за своими тарифами!" }],
});

onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      router.push("/register");
    } else if (user && typeof route.query.redirect === "string") {
      router.push(route.query.redirect);
    }
  });
});
</script>

<style>
/* min-width:48rem -> 1rem 10px
  max-width:112rem
  fsfs
*/

*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  --primary: hsl(155, 100%, 65%);
  --red: #ff3227;
  --link: #4263eb;
  --link-visited: #ae3ec9;
  --text-1: #212529;
  --text-2: #495057;
  --surface-1: #f8f9fa;
  --surface-2: #e9ecef;
  --surface-3: #dee2e6;
  --surface-4: #ced4da;
  --hg-dark: hsl(210 10% 5%/25%);
  --hg-light: hsl(210 10% 71%/25%);
  --highlight: var(--hg-light);
  --scrollbar-color: #495057;
  --shadow: 0 3px 5px -2px hsl(220 3% 15% / calc(1% + 3%)),
    0 7px 14px -5px hsl(220 3% 15% / calc(1% + 5%));

  &:has(.dark) {
    color-scheme: dark;
  }
  &:has(.light) {
    color-scheme: light;
  }
  /* color-scheme: light dark; */
}

html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}

/* :where(html.dark) {
  color-scheme: dark;
}
:where(html.light) {
  color-scheme: light;
} */

html {
  accent-color: var(--link);
  -webkit-text-size-adjust: none;
  background-color: var(--surface-1);
  block-size: 100%;
  caret-color: var(--link);
  color: var(--text-2);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell,
    Noto Sans, sans-serif, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans,
    sans-serif, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
  scrollbar-color: var(--scrollbar-color) transparent;
}

button {
  --_text: initial;
  --_bg-light: #fff;
  --_bg-dark: var(--surface-3);
  --_bg: var(--_bg-light);
  --_border: var(--surface-3);
  user-select: none;
  padding-block: 0.75ch;
  padding-inline: 1.75ch;
  display: inline-flex;
  text-align: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid black;
  font-weight: 700;
  font-size: initial;
  cursor: pointer;
  line-height: 1.5;
  align-items: center;
  transition: all 0.2s ease;

  box-shadow: var(--shadow), 0 0 0 var(--hg-size) var(--highlight);
  border: 2px solid var(--_border);
  background: var(--_bg);
  color: var(--_text);
}

html.dark {
  --link: #91a7ff;
  --link-visited: #e599f7;
  --text-1: #f1f3f5;
  --text-2: #ced4da;
  --surface-1: #212529;
  --surface-2: #343a40;
  --surface-3: #495057;
  --surface-4: #868e96;

  --shadow: 0 3px 5px -2px hsl(220 40% 2% / calc(25% + 3%)),
    0 7px 14px -5px hsl(220 40% 2% / calc(25% + 5%));
  --highlight: var(--hg-dark);
}

html.dark button {
  --_bg: var(--_bg-dark);
}

html:has(dialog[open]) {
  overflow: hidden;
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin-block-end: 0;
}

ul[role="list"],
ol[role="list"] {
  list-style: none;
}

body {
  min-height: 100vh;
  line-height: 1.5;
  margin: 0;
}

h1,
h2,
h3,
h4,
button,
input,
label {
  line-height: 1.1;
}

h1,
h2,
h3,
h4 {
  text-wrap: balance;
}

a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}

img,
picture {
  max-width: 100%;
  display: block;
}

input,
button,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  font: inherit;
  font-size: inherit;
  letter-spacing: inherit;
}

button:hover {
  --hg-size: 0.5rem;
}
button {
  font-weight: 700;
}

textarea:not([rows]) {
  min-height: 10em;
}

:target {
  scroll-margin-block: 5ex;
}
</style>
