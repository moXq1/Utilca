import { FirebaseError } from "firebase/app";
import { ref, update } from "firebase/database";
import { database } from "~/server/utils/useFirebaseServer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    //@ts-ignore
    const addressRef = ref(database, "/address/" + body.userID + "/" + body.id);

    await update(addressRef, body);

    return body;
  } catch (e) {
    throw createError({
      //@ts-ignore
      statusCode: e.statusCode || 400,
      statusMessage: "Error while updating address data",
    });
  }
});
