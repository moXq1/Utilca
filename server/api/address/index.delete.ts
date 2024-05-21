import { ref, remove } from "firebase/database";
import { database } from "~/server/utils/useFirebaseServer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    //@ts-ignore
    const addressRef = ref(database, "/address/" + body.userID + "/" + body.id);
    //@ts-ignore
    const tarifRef = ref(database, "/tarif/" + body.userID + "/" + body.id);

    // const tarifReference = ref(database, `/tarif/${body.userID}/${body.id}`);

    await remove(addressRef);

    await remove(tarifRef);

    // await remove(tarifReference);
  } catch (e) {
    throw createError({
      //@ts-ignore
      statusCode: e.statusCode || 400,
      statusMessage: "Error while deleting address data",
    });
  }
});
