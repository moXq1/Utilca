export function usePagData(url: string, limit?: number) {
  const route = useRoute();
  const router = useRouter();
  let l = limit ?? 12;
  const lastKey = ref(route.query.lt ? route.query.lt : "");
  const prevKey = ref(route.query.pv ? route.query.pv : "");
  const data = ref();
  const error = ref();
  const pending = ref();
  const nextPage = ref();
  const prevPage = ref();

  async function lazyFetch() {
    pending.value = true;
    const {
      data: dt,
      error: et,
      pending: pt,
    } = await useLazyAsyncData<{ data: Tarif[]; hasNextPage: boolean }>(
      "tarif",
      () =>
        $fetch(url, {
          query: {
            limit: l,
            lastKey: lastKey.value,
          },
        })
    );

    if (et.value) {
      error.value = et.value;
      data.value = [];
    } else {
      //@ts-ignore
      const { data: d, hasNextPage, hasPrevPage } = dt!.value;
      nextPage.value = hasNextPage;
      prevPage.value = hasPrevPage;
      data.value = d ?? [];
      if (hasNextPage) {
        lastKey.value = d[d.length - 1].createdAt;
      }
      if (hasPrevPage) {
        prevKey.value = d[0].createdAt;
      }
      pending.value = pt.value;
    }
  }

  async function nextPageData(lt?: string) {
    const temp = lastKey.value;

    try {
      const {
        data: d,
        hasNextPage,
        hasPrevPage,
      }: {
        data: Tarif[];
        hasNextPage: boolean;
        hasPrevPage: boolean;
      } = await $fetch(url, {
        query: {
          limit: l,
          lastKey: !!lt ? "" : lastKey.value,
        },
      });
      router.push({
        path: route.path,
        query: { lt: temp, pv: d[0].createdAt },
      });

      nextPage.value = hasNextPage;
      prevPage.value = hasPrevPage;
      if (d.length === 0) {
        return;
      }
      data.value = d;
      if (hasNextPage) {
        lastKey.value = d[d.length - 1].createdAt ?? "";
      }

      prevKey.value = d[0].createdAt ?? "";
    } catch (err) {
      error.value = err;
    }

    // tarifs.value = data.value ?? [];
  }

  async function prevPageData(lt?: string) {
    try {
      const {
        data: d,
        hasNextPage,
        hasPrevPage,
      }: {
        data: Tarif[];
        hasNextPage: boolean;
        hasPrevPage: boolean;
      } = await $fetch(url, {
        query: {
          limit: l,
          lastKey: lt ? "" : prevKey.value,
          prev: prevKey.value,
        },
      });

      nextPage.value = hasNextPage;
      prevPage.value = hasPrevPage;
      if (!hasPrevPage) {
        router.push({
          path: route.path,
          query: {},
        });
      } else {
        router.push({
          path: route.path,
          query: { lt: d[0].createdAt, pv: d[d.length - 1].createdAt },
        });
      }

      data.value = d;

      lastKey.value = d[0].createdAt ?? "";
      if (prevPage) {
        prevKey.value = d[d.length - 1].createdAt ?? "";
      }
    } catch (err) {
      error.value = err;
    }
  }

  return {
    data,
    error,
    pending,
    lazyFetch,
    nextPageData,
    prevPageData,
    isPrevPage: prevPage,
    isNextPage: nextPage,
  };
}
