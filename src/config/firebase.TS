import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBELiTPCC31tPzxPbjOZniMz0W5Wfkl_QU",
  authDomain: "polling-app-3f7c1.firebaseapp.com",
  projectId: "polling-app-3f7c1",
  storageBucket: "polling-app-3f7c1.firebasestorage.app",
  messagingSenderId: "669398376630",
  appId: "1:669398376630:web:6afb3fe10fb28fd9b30617",
  measurementId: "G-GWG8VPQ116"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);