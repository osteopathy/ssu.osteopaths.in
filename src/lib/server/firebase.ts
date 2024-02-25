// Import the functions you need from the SDKs you need
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET } from "$env/static/private";
import { initializeApp } from "firebase/app";
import { addDoc, collection, collectionGroup, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// CRUD for articles

export const articleAPI = {
    get: async (osteopathId:string="") => {
      const articles = await getDocs(collection(db, "articles"));
      articles.forEach(async (d) => {
        console.log(d.id, d.data());
      })
    },
    new: async (osteopathId:string) => {
      // Add a new document with a generated id.
      await addDoc(collection(db, "articles", osteopathId), {
        title: "New article",
        content: "This is a new article"
      });
    }
}