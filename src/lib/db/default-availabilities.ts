import {
	PUBLIC_FIREBASE_API_KEY as FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID as FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN as FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID as FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID as FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET as FIREBASE_STORAGE_BUCKET,
} from "$env/static/public"
import { initializeApp } from 'firebase/app';
import {
    deleteDoc,
    doc,
	getDoc,
	getFirestore,
    setDoc,
	updateDoc,
} from 'firebase/firestore';

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

const days = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday'
] as const;

export type Availability = Record<(typeof days)[number],{
    startTime: string;
    endTime: string;
}[]>

export const availabilityAPI = {
	get: async (course:string, batch: string) => {
		const data = await getDoc(doc(db, 'availabilities', `${course}-${batch}`));
		const availability = data.data() as Availability | undefined;
		if(availability) {
			for (let index = 0; index < days.length; index++) {
				const dayAvailability = availability[days[index]];
				if(dayAvailability === undefined) {
					await updateDoc(doc(db, 'availabilities', `${course}-${batch}`), {
						[days[index]]: []
					})
				}
			}
		} else {
			await setDoc(doc(db, 'availabilities', `${course}-${batch}`), {
				sunday: [],
				monday: [],
				tuesday: [],
				wednesday: [],
				thursday: [],
				friday: [],
				saturday: []
			})
			return {
				sunday: [],
				monday: [],
				tuesday: [],
				wednesday: [],
				thursday: [],
				friday: [],
				saturday: []
			}
		}
        return data.data() as Availability;
	},
	set: async (course:string, batch: string, day:string, availability: any) => {
        await updateDoc(doc(db, 'availabilities', `${course}-${batch}`), {
			[day]: availability
		})
		return {
			id: `${course}-${batch}`
		};
	},
	del: async (course:string, batch: string) => {
		const articleRef = doc(db, 'availabilities', `${course}-${batch}`);
		await deleteDoc(articleRef);
		return {
			id: `${course}-${batch}`
		};
	},	
};
