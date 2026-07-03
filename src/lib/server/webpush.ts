import webPush from "web-push";
import { PUBLIC_VAPID_KEY as VAPID_PUBLIC_KEY } from "$env/static/public";
import { VAPID_PRIVATE_KEY, VAPID_SUBJECT } from "$env/static/private";

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export { webPush };
