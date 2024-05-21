import { FirebaseApp } from "@firebase/app-types";
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import admin from "firebase-admin";

const config = {
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
