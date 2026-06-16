# Notifications Feature Documentation

This document describes the notification system implementation including email notifications and in-app notification center.

## Features

### 1. Multiple Notification Types
- **Push Notifications**: Browser push notifications (existing)
- **Email Notifications**: Email delivery via Resend (new)
- **In-App Notifications**: Notification center UI (new)

### 2. In-App Notification Center
- Bell icon in the header shows unread count
- Click to open notification panel
- Mark individual notifications as read
- Mark all notifications as read
- Auto-refreshes every 30 seconds
- Shows notification timestamp (e.g., "5m ago", "2h ago")

## Database Schema

The `user_notification` table includes:
- `id`: Unique identifier
- `title`: Notification title (required)
- `body`: Notification body text (required)
- `type`: Notification type (`push`, `email`, `in-app`)
- `status`: Optional status field
- `data`: JSON field for additional metadata
- `readAt`: Timestamp when notification was read (null = unread)
- `userId`: User ID (foreign key)
- `createdAt`: Creation timestamp

## API Endpoints

### Send Notification
**POST** `/api/v1/push/send`

Send a notification to a user via multiple channels.

```json
{
  "title": "New Appointment",
  "body": "You have a new appointment request",
  "userId": "user-id",
  "types": ["in-app", "push", "email"],
  "data": {
    "appointmentId": "123",
    "url": "/appointments/123"
  }
}
```

**Parameters:**
- `title` (required): Notification title
- `body` (required): Notification body text
- `userId` (required): Target user ID
- `types` (optional): Array of notification types. Default: `["in-app"]`
  - Options: `"push"`, `"email"`, `"in-app"`
- `data` (optional): Additional metadata as JSON object

### Get Notifications
**GET** `/api/v1/notifications?limit=50&offset=0&unread=false`

Retrieve notifications for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of notifications to return. Default: 50
- `offset` (optional): Number of notifications to skip. Default: 0
- `unread` (optional): Filter for unread notifications only. Default: false

**Response:**
```json
{
  "notifications": [
    {
      "id": "notif-id",
      "title": "New Appointment",
      "body": "You have a new appointment request",
      "type": "in-app",
      "status": null,
      "data": { "appointmentId": "123" },
      "readAt": null,
      "userId": "user-id",
      "createdAt": "2025-12-10T08:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Mark Notification as Read
**PATCH** `/api/v1/notifications/[id]`

Mark a specific notification as read.

### Mark All Notifications as Read
**PATCH** `/api/v1/notifications/read-all`

Mark all user's notifications as read.

## Email Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Resend API Key for email notifications
# Get your API key from https://resend.com
RESEND_API_KEY="re_..."
```

### Email Template

The default email template is defined in `src/lib/server/email.ts` in the `generateNotificationEmail()` function. Customize it as needed.

## Usage Examples

### Send Email Notification
```typescript
await fetch('/api/v1/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Appointment Confirmed',
    body: 'Your appointment has been confirmed for tomorrow at 2 PM',
    userId: user.id,
    types: ['email', 'in-app']
  })
});
```

### Send Push + Email + In-App
```typescript
await fetch('/api/v1/push/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Important Update',
    body: 'Your appointment has been rescheduled',
    userId: user.id,
    types: ['push', 'email', 'in-app'],
    data: {
      appointmentId: '123',
      newDate: '2025-12-15T14:00:00Z'
    }
  })
});
```

### Fetch Unread Notifications
```typescript
const response = await fetch('/api/v1/notifications?unread=true');
const { notifications } = await response.json();
console.log(`You have ${notifications.length} unread notifications`);
```

## UI Components

### Notification Center Component
Located at: `src/lib/components/notification-center.svelte`

The notification center is automatically included in the AppShell and appears in the header for authenticated users.

Features:
- Bell icon with unread count badge
- Slide-out panel with notification list
- Click notification to mark as read
- "Mark all read" button
- Responsive design (mobile & desktop)
- Auto-refresh every 30 seconds

## Database Migration

Run the migration to update your database schema:

```bash
npm run db:push
```

Or generate and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

## Testing

### Manual Testing Checklist

1. **Email Notifications:**
   - Set up Resend API key in `.env`
   - Send a test notification with `types: ['email']`
   - Verify email is received

2. **In-App Notifications:**
   - Send a notification with `types: ['in-app']`
   - Check notification center shows the notification
   - Verify unread count badge appears
   - Click notification to mark as read
   - Verify unread count updates

3. **Push Notifications:**
   - Enable push notifications in browser
   - Send notification with `types: ['push']`
   - Verify push notification appears

4. **Combined:**
   - Send notification with `types: ['push', 'email', 'in-app']`
   - Verify all three channels work correctly

## Future Enhancements

Potential improvements:
- Notification preferences (user settings for which types they want)
- Rich notification content (images, action buttons)
- Notification categories/groups
- Email templates for different notification types
- Notification scheduling
- Batch notification sending
- Notification analytics
