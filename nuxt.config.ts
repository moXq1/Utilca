import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    emitRouteChunkError: false,
  },
  vite: {
    plugins: [svgLoader()],
  },

  modules: ["nuxt-vuefire", "@pinia/nuxt"],

  vuefire: {
    auth: { enabled: true, sessionCookie: true },

    config: {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
    },
  },
});
