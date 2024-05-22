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
if (!getApps().length) {
  app = admin.initializeApp(config);
} else {
  app = getApp();
  deleteApp(app);
  app = admin.initializeApp(config);
}

export const database = app.database();

export async function getAddresses(userID: string) {}
