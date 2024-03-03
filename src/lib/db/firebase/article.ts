// Import the functions you need from the SDKs you need
import type { JSONContent } from "@tiptap/core";
import {
	type Timestamp,
	addDoc,
	and,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where
} from 'firebase/firestore';
import { db } from ".";

type Data = {
	id: string;
	title?: string;
	summary?: string;
	content?: JSONContent;
	draft?: boolean;
	publish_date?: Timestamp;
	created_at?: Timestamp;
	updated_at?: Timestamp;
	author_id: string;
};

const processedData = (d:any) => {
	return JSON.parse(JSON.stringify({
		id: d.id,
		...d.data(),
		publishDate: d.data().publishDate?.toDate(),
		createdAt: d.data().createdAt?.toDate(),
		updatedAt: d.data().updatedAt?.toDate()
	}))
}

export const articleAPI = {
	getAll: async ({osteopathId, onlyPublished}:{
		osteopathId?: string;
		onlyPublished?: boolean;
	}) => {
		const articlesRef = collection(db, 'articles');
		let articles;
		if( osteopathId && onlyPublished) {
			articles = await getDocs(query(articlesRef, and(where('draft', '==', false),where('author_id', '==', osteopathId))));
		}else if(osteopathId) {
			articles = await getDocs(query(articlesRef, where('author_id', '==', osteopathId)));
		} else if (onlyPublished) {
			articles = await getDocs(query(articlesRef, where('draft', '==', false)));
		} else {
			articles = await getDocs(articlesRef);
		}

		return articles.docs.map((d) => (processedData(d)))as Data[];
	},
	get: async (articleId: string) => {
		const article = await getDoc(doc(db, 'articles', articleId));
		return {
			...processedData(article),
			id: article.id,
		} as Data;
	},
	new: async (osteopathId: string, data: Omit<Data,'id'|'author_id'> = {}) => {
		// Add a new document with a generated id.
		// await setDoc(doc(db, "articles", osteopathId),{...data,osteopathId})
		const result = await addDoc(collection(db, 'articles'), {
			...data,
			publish_date: null,
			draft: true,
			author_id: osteopathId,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp()
		});

		return {
			id: result.id,
			...data,
			author_id: osteopathId,
		};
	},
	put: async (articleId: string, data: Omit<Data,'id'>) => {
		const articleRef = doc(db, 'articles', articleId);
		await updateDoc(articleRef, {
			...data,
			updatedAt: serverTimestamp()
		});
		return {
			id: articleId,
			...data
		};
	},
	del: async (articleId: string) => {
		const articleRef = doc(db, 'articles', articleId);
		await deleteDoc(articleRef);
		return {
			id: articleId
		};
	},
	publish: async (articleId: string) => {
		const articleRef = doc(db, 'articles', articleId);
		await updateDoc(articleRef, {
			draft: false,
			publish_date: serverTimestamp()
		});
		return {
			id: articleId
		};
	},
	unpublish: async (articleId: string) => {
		const articleRef = doc(db, 'articles', articleId);
		await updateDoc(articleRef, {
			draft: true,
			publish_date: null
		});
		return {
			id: articleId
		};
	}	
};
