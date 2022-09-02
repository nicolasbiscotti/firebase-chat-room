import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./firebase-config";


const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

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
