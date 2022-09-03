import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./firebase-config";

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

export function subscribeAuthListener(authListener) {
  return onAuthStateChanged(getAuth(), authListener);
}

export async function signIn() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(getAuth(), provider);
}

export function signOutUser() {
  signOut(getAuth());
}

export function getProfilePicUrl() {
  return getAuth().currentUser.photoURL;
}
export function getUserName() {
  return getAuth().currentUser.displayName;
}

export function isUserSignIn() {
  return !!getAuth().currentUser;
}

export async function saveMessage(messageText) {
  try {
    await addDoc(collection(getFirestore(), "messages"), {
      name: getUserName(),
      text: messageText,
      profilePicUrl: getProfilePicUrl(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database.", error);
  }
}
