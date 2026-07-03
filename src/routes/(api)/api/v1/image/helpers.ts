import {
	PUBLIC_CLOUDINARY_CLOUD_NAME,
	PUBLIC_CLOUDINARY_UPLOAD_PRESET
} from "$env/static/public";
import { env } from '$env/dynamic/public';

const PUBLIC_CLOUDINARY_CLOUD_NAME = publicEnv.PUBLIC_CLOUDINARY_CLOUD_NAME;
const PUBLIC_CLOUDINARY_UPLOAD_PRESET = publicEnv.PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Uploading File utils
type ElEvent<T extends Event, E extends Element> = T & { currentTarget: EventTarget & E };

type UploadResponse = {
	fileName: string;
	url: string;
	message: string;
};

export type InputChangeEvent = ElEvent<Event, HTMLInputElement>;

export async function uploadImageToCloudinary(url: string): Promise<UploadResponse | null> {
	const file = await fetch(url)
		.then((r) => r.blob())
		.then((blobFile) => new File([blobFile], "avatar", { type: blobFile.type }));

	if (!file) return null;

	const fileName = file.name.split(".")[0] || "";
	const isImage = file.type.includes("image");
	const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB

	console.log(`File Size: ${fileSizeInMB}`);

	if (!isImage) return null;

	const hostedURL = await uploadFile(file);

	if (!hostedURL) return null;

	return { fileName, url: hostedURL, message: "Image is Uploaded" };
}

export async function syncCloudinaryURLToDatabase(userId: string, url: string) {
	await fetch("/api/v1/image", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId, url })
	});
}

export async function deleteImage(userId: string, url: string) {
	await fetch("/api/v1/image", {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ userId, url })
	});
}

const uploadFile = async (file: File): Promise<string | undefined> => {
	if (!file || (!file.type.includes("image") && !file.type.includes("video"))) {
		return undefined;
	}

	const formData = new FormData();
	formData.append("file", file, file.name);
	formData.append("upload_preset", PUBLIC_CLOUDINARY_UPLOAD_PRESET);
	formData.append("cloud_name", PUBLIC_CLOUDINARY_CLOUD_NAME);

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/${
				file.type.includes("image") ? "image" : "video"
			}/upload`,
			{
				method: "POST",
				body: formData
			}
		);
		const image = await res.json();
		return image.secure_url;
	} catch (err) {
		console.error(err);
		return undefined;
	}
};
