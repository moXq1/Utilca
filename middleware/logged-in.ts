export default defineNuxtRouteMiddleware(async (to) => {
  const user = await getCurrentUser();

  if (user) {
    if (to.path.includes("/register")) {
      console.log("Authenticated user redirected from auth page");
      return navigateTo("/");
    }
    return await navigateTo({
      path: "/",
      // query: {
      //   redirect: to.fullPath,
      // },
    });
  }
});
