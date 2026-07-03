import webPush from "web-push";
import { env } from "$env/dynamic/private";

const VAPID_PUBLIC_KEY = env.PUBLIC_VAPID_KEY;
const VAPID_PRIVATE_KEY = env.PRIVATE_VAPID_KEY;
const VAPID_SUBJECT = env.VAPID_SUBJECT;

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export { webPush };
