import { v2 as cloudinary } from "cloudinary";
import { env } from "$env/dynamic/private";
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$lib/const';
;
const CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET;

cloudinary.config({
	cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
	secure: true
});

export default cloudinary;
// cloudinary.uploader .upload("my_image.jpg") .then(result=>console.log(result));
