import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOYSHVQU4bSECSopO64fYDhPaDf3FuVGg",
  authDomain: "blog-tutorial-3f90b.firebaseapp.com",
  projectId: "blog-tutorial-3f90b",
  storageBucket: "blog-tutorial-3f90b.appspot.com",
  messagingSenderId: "477840613756",
  appId: "1:477840613756:web:adbded0f9c070f0395c4f9",
  measurementId: "G-Y44EDLJPJ4",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const increment = firebase.firestore.FieldValue.increment;
//helper functinos


export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;


