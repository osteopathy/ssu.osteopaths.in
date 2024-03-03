import {
	PUBLIC_FIREBASE_API_KEY as FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID as FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN as FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID as FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID as FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET as FIREBASE_STORAGE_BUCKET,
	PUBLIC_VAPID_KEY,
} from "$env/static/public"
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export function initializeFirebaseIfNeeded() {
	if (getApps().length > 0) {
		return getApps()[0];
	}
	return initializeApp(firebaseConfig);
}

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
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseCloudMessaging = {
	//checking whether token is available in indexed DB
	tokenInlocalforage: async () => {
		return localStorage.getItem('fcm_token')
	},
	//initializing firebase app
	init: async function () {
		try {
			const tokenInLocalForage = await this.tokenInlocalforage()
			//if FCM token is already there just return the token
			if (tokenInLocalForage !== null) {
				return tokenInLocalForage
			}
			const messaging = getMessaging(app)
			console.log(messaging)
			const status = await Notification.requestPermission()
			if (status && status === 'granted') {
				//getting token from FCM
				const fcm_token = await getToken(messaging, {
					vapidKey: PUBLIC_VAPID_KEY,
				})
				console.log(fcm_token)
				if (fcm_token) {
					//setting FCM token in indexed db using localforage
					localStorage.setItem('fcm_token', fcm_token)
					//return the FCM token after saving it
					return fcm_token
				}
			}
		} catch (error) {
			console.error(error)
			return null;
		}
	},
	getMessage: async function () {
		if (firebase.getApps().length > 0) {
			try {
				const messaging = getMessaging();
				onMessage(messaging, (payload) => {
					console.log("Message Received", payload)
				})
			} catch (error) {
				console.error(error)
				return null;
			}
		}
	}
}

export { firebaseCloudMessaging }