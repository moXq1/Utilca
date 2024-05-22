import { FirebaseApp } from "@firebase/app-types";
import { getAuth } from "firebase-admin/auth";

import { ref, get, getDatabase } from "firebase/database";
import dataToArr from "~/server/utils/dataToArr";
import { database, getAddresses } from "~/server/utils/useFirebaseServer";

export default defineEventHandler(async (event) => {
  const userID = event?.context?.params?.userID;
  if (!userID) {
    return "failed";
  }

  //@ts-ignore
  const addressRef = ref(database, `address/${userID}`);

  console.log(database);
  try {
    let data = await get(addressRef);
    data = data.val();
    if (!data) {
      return [];
    }
    return dataToArr(data);
  } catch (e) {
    throw createError({
      //@ts-ignore
      statusCode: e.statusCode || 400,
      statusMessage: "Error can't get the address data",
    });
  }
});
