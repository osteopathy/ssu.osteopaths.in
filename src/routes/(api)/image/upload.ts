import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from '$env/static/public';

// Uploading File utils
type ElEvent<T extends Event, E extends Element> = T & { currentTarget: EventTarget & E };

type UploadResponse = {
	fileName: string;
	url: string;
	message: string;
};

export type InputChangeEvent = ElEvent<Event, HTMLInputElement>;

export async function uploadImage(event: InputChangeEvent): Promise<UploadResponse> {
	return new Promise<UploadResponse>((resolve, reject) => {
		const selectedFile = event.currentTarget.files?.[0];
		if (!selectedFile) {
			reject({ message: 'No file selected' });
			return;
		}
		const fileName = selectedFile.name.split('.')[0] || '';
		const isImage = selectedFile.type.includes('image');
		const fileSizeInMB = selectedFile.size / (1024 * 1024); // Convert bytes to MB
		console.log(`File Size: ${fileSizeInMB}`);

		if (!isImage) {
			reject({ message: `Video is not supported` });
			return;
		}

		uploadFile(selectedFile)
			.then((url) => {
				if (url) {
					resolve({ fileName, url, message: 'Image is Uploaded' });
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export const uploadFile = async (file: File): Promise<string | undefined> => {
	if (!file || (!file.type.includes('image') && !file.type.includes('video'))) {
		return undefined;
	}

	const formData = new FormData();
	formData.append('file', file, file.name);
	formData.append('upload_preset', PUBLIC_CLOUDINARY_UPLOAD_PRESET);
	formData.append('cloud_name', PUBLIC_CLOUDINARY_CLOUD_NAME);

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/${
				file.type.includes('image') ? 'image' : 'video'
			}/upload`,
			{
				method: 'POST',
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
