export default defineNuxtRouteMiddleware(async (to) => {
  const user = await getCurrentUser();

  if (!user) {
    return await navigateTo({
      path: "/register",
      // query: {
      //   redirect: to.fullPath,
      // },
    });
  }
});
