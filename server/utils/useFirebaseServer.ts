import { FirebaseApp } from "@firebase/app-types";
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import admin from "firebase-admin";

//@ts-ignore
const cred = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const config = {
  credential: admin.credential.cert(cred),
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

let app;
console.log(app);

// if (!getApps().length) {
//   console.log("fdfd");
//   app = admin.initializeApp(config);
//   console.log(getApps());
// } else {
//   console.log(getApps());
//   console.log(2121);
//   app = getApp();
// }
if (!getApps().length) {
  app = admin.initializeApp(config);
}
// else {
//   console.log(getApps().length);
//   console.log(getApp());
//   let apps = getApps();
//   apps.forEach((a) => deleteApp(a));
//   // deleteApp(app);
//   app = admin.initializeApp(config);
// }

export const database = app.database();

// console.log(database);

export async function getAddresses(userID: string) {}
