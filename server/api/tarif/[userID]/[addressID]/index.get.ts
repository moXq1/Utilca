import { FirebaseApp } from "@firebase/app-types";
import { getAuth } from "firebase-admin/auth";

import {
  ref,
  get,
  getDatabase,
  orderByChild,
  limitToFirst,
  startAfter,
  query,
  limitToLast,
  endBefore,
} from "firebase/database";
import dataToArr from "~/server/utils/dataToArr";
import { database, getAddresses } from "~/server/utils/useFirebaseServer";

export default defineEventHandler(async (event) => {
  const userID = event?.context?.params?.userID;
  const addressId = event?.context?.params?.addressID;

  const {
    limit,
    lastKey,
    prev,
  }: { limit: number; lastKey?: string; prev?: string } = getQuery(event);

  const l = Number(limit) || 12;

  //@ts-ignore
  const tarifRef = ref(database, `tarif/${userID}/${addressId}`);
  //
  let qConstrains = [orderByChild("createdAt"), limitToLast(l + 1)];

  if (lastKey && prev) {
    qConstrains = [
      orderByChild("createdAt"),
      startAfter(lastKey),
      limitToFirst(l + 1),
    ];
  } else if (lastKey) {
    qConstrains = [
      orderByChild("createdAt"),
      endBefore(lastKey),
      limitToLast(l + 1),
    ];
  }
  try {
    let q = await query(tarifRef, ...qConstrains);
    let r: Tarif[] = [];
    let d = await get(q);

    d.forEach((g) => {
      r.push(g.val());
    });

    if (!r.length) {
      return { data: [], hasNextPage: false, hasPrevPage: false };
    }

    r = !!prev ? r : r.reverse();
    if (prev) {
      const hasPrevPage = r.length > l;
      return { data: r.slice(0, l), hasPrevPage, hasNextPage: true };
    }
    const hasNextPage = r.length > l;
    return { data: r.slice(0, l), hasNextPage, hasPrevPage: !!lastKey };
  } catch (e) {
    throw createError({
      //@ts-ignore
      statusCode: e.statusCode || 400,
      statusMessage: "Error can't get the tarif data",
    });
  }
});
