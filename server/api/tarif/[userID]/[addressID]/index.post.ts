import { ref, set } from "firebase/database";
import { database } from "~/server/utils/useFirebaseServer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    //@ts-ignore
    const tarifRef = ref(
      //@ts-ignore
      database,
      "/tarif/" + body.userID + "/" + body.addressID + "/" + body.id
    );

    await set(tarifRef, body);

    return body;
  } catch (e) {
    throw createError({
      //@ts-ignore
      statusCode: e.statusCode || 400,
      statusMessage: "Error while creating tarif ",
    });
  }
});
