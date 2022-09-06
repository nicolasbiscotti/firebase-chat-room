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
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "./firebase-config";

// initialize the firebase app
const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

// auth functions
export async function signIn() {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(getAuth(), provider);
}

export function signOutUser() {
  signOut(getAuth());
}

export function getProfilePicUrl() {
  return addSizeToGoogleProfilePic(getAuth().currentUser.photoURL);
}
export function getUserName() {
  return getAuth().currentUser.displayName;
}

export function isUserSignIn() {
  return !!getAuth().currentUser;
}

export function subscribeAuthListener(authListener) {
  return onAuthStateChanged(getAuth(), authListener);
}

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

// collection
const getMessagesCollection = () => collection(getFirestore(), "messages");

// writers
export async function saveMessage(messageText) {
  return await addDoc(getMessagesCollection(), {
    name: getUserName(),
    text: messageText,
    profilePicUrl: getProfilePicUrl(),
    timestamp: serverTimestamp(),
  });
}

// listeners susbscription
export function susbscribeMessagesListener(messageListener) {
  const recentMessagesQuery = query(
    getMessagesCollection(),
    orderBy("timestamp", "desc"),
    limit(12)
  );
  return onSnapshot(recentMessagesQuery, (snapshot) => {
    const updates = {};
    snapshot.docChanges().forEach((change) => {
      const id = change.doc.id;
      const message = change.doc.data();
      if (change.type === "added") {
        updates.newMessage = { id, ...message };
        messageListener(updates);
      }
      if (change.type === "removed") {
        updates.deletedMessage = { id, ...message };
        messageListener(updates);
      }
    });
  });
}
