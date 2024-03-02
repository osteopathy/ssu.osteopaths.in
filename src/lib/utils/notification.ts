

export async function requestNotificationPermission(): Promise<boolean> {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            return true;
        } else {
            console.log('Notification permission denied.');
            return false;
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
}

/**
 * Sends a notification with the given title and options.
 * @param title - The title of the notification.
 * @param options - The options for the notification.
 * @returns A promise that resolves to a boolean indicating whether the notification was sent successfully.
 */
export async function sendNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    try {
        if (Notification.permission !== 'granted') {
            console.log('Notification permission not granted.');
            return false;
        }
        const notification = new Notification(title, options);
        console.log('Notification sent:', notification);
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
}