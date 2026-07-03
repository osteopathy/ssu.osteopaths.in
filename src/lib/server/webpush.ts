import webPush from "web-push";
import { env } from "$env/dynamic/private";
import { env as publicEnv } from '$env/dynamic/public';

const VAPID_PUBLIC_KEY = publicEnv.PUBLIC_VAPID_KEY;
const VAPID_PRIVATE_KEY = env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = env.VAPID_SUBJECT;

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export { webPush };
