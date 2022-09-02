const firebaseConfig = {
  apiKey: "AIzaSyB6EhyASKRxp4YWeMz4PGHems1vXUxp-Ps",
  authDomain: "chat-room-658e3.firebaseapp.com",
  projectId: "chat-room-658e3",
  storageBucket: "chat-room-658e3.appspot.com",
  messagingSenderId: "953337550679",
  appId: "1:953337550679:web:34e2765532f6a11af91012",
};

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(`No Firebase configuration object provided.
    Add your web app's configuration object to firebase-config.js`);
  } else {
    return firebaseConfig;
  }
}
