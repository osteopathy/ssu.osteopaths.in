# Quick Reference Guide - Osteopaths.in

A quick reference for common tasks, patterns, and code snippets.

---

## 📁 Important File Locations

```
Authentication         → src/lib/server/auth/
Database Schemas       → src/lib/database/schema/
UI Components          → src/lib/components/
Icons                  → src/lib/icons/
Routes                 → src/routes/
Form Validation        → routes/*/schema.ts files
```

---

## 🗄️ Database Operations

### Query Examples

```typescript
import { db } from '$lib/database';
import { eq, and, or, like, gte, lte } from 'drizzle-orm';
import { userTable, serviceProviderTable } from '$lib/database/schema';

// Find one record with relations
const user = await db.query.userTable.findFirst({
  where: eq(userTable.id, userId),
  with: {
    sessions: true,
    student: true,
    serviceProviders: true
  }
});

// Find many with conditions
const providers = await db.query.serviceProviderTable.findMany({
  where: and(
    eq(serviceProviderTable.serviceId, serviceId),
    eq(serviceProviderTable.location, 'Sri Sri University')
  ),
  with: {
    user: true,
    service: true
  }
});

// Select with SQL builder
const users = await db
  .select()
  .from(userTable)
  .where(eq(userTable.role, 'service_provider'));

// Insert
await db.insert(userTable).values({
  id: generateId(),
  email: 'user@example.com',
  name: 'John Doe',
  role: 'user'
});

// Update
await db
  .update(userTable)
  .set({ name: 'Jane Doe' })
  .where(eq(userTable.id, userId));

// Delete
await db
  .delete(userTable)
  .where(eq(userTable.id, userId));
```

### Using Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.insert(userTable).values(userData);
  await tx.insert(studentTable).values(studentData);
});
```

---

## 🔐 Authentication

### Check Authentication in Page

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect if not authenticated
  if (!locals.user) {
    redirect(302, '/login/google');
  }
  
  // Check role
  if (locals.user.role !== 'service_provider') {
    redirect(302, '/');
  }
  
  return {
    user: locals.user
  };
};
```

### Set Session Cookie

```typescript
import { setSessionTokenCookie, generateSessionToken } from '$lib/server/auth/session';

const token = generateSessionToken();
setSessionTokenCookie(event, token, expiresAt);
```

### Get Current User

```typescript
// Available in +page.server.ts and +server.ts
const user = event.locals.user;
const session = event.locals.session;
```

---

## 📝 Form Handling

### Define Schema (schema.ts)

```typescript
import { z } from 'zod';

export const bookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  start_at: z.string().min(1, 'Start time is required'),
  end_at: z.string().min(1, 'End time is required'),
  note: z.string().optional()
});
```

### Server Action (+page.server.ts)

```typescript
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  create: async (event) => {
    // Validate
    const form = await superValidate(event.request, zod(bookingSchema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    // Process
    try {
      await db.insert(table).values(form.data);
      return message(form, 'Success!');
    } catch (error) {
      return fail(400, { form, error: 'Failed to save' });
    }
  }
};
```

### Form Component

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import Button from '$lib/components/ui/button/button.svelte';
  
  let { data } = $props();
  
  const { form, errors, enhance, delayed } = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'success') {
        // Handle success
      }
    }
  });
</script>

<form method="POST" action="?/create" use:enhance>
  <input
    type="text"
    name="date"
    bind:value={$form.date}
  />
  {#if $errors.date}
    <span class="text-red-500">{$errors.date}</span>
  {/if}
  
  <Button type="submit" disabled={$delayed}>Submit</Button>
</form>
```

---

## 🎨 UI Components

### Button

```svelte
<script>
  import Button from '$lib/components/ui/button/button.svelte';
</script>

<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">⚙️</Button>

<!-- As link -->
<Button href="/path">Link Button</Button>

<!-- Disabled -->
<Button disabled>Disabled</Button>
```

### Avatar

```svelte
<script>
  import Avatar from '$lib/components/ui/avatar/avatar.svelte';
</script>

<Avatar 
  src={user.picture} 
  alt={user.name}
  fallback={user.name.substring(0, 2)}
  class="size-12"
/>
```

### Form Inputs

```svelte
<script>
  import Input from '$lib/components/ui/form/input.svelte';
  import Textarea from '$lib/components/ui/form/textarea.svelte';
  import Label from '$lib/components/ui/form/label.svelte';
</script>

<Label for="email">Email</Label>
<Input 
  id="email"
  type="email" 
  placeholder="Enter email"
  bind:value={email}
/>

<Label for="note">Note</Label>
<Textarea
  id="note"
  placeholder="Enter note"
  bind:value={note}
/>
```

### Icons

```svelte
<script>
  import CalendarIcon from '$lib/icons/CalendarEditIcon.svelte';
  import PersonIcon from '$lib/icons/PersonIcon.svelte';
</script>

<CalendarIcon />
<PersonIcon />
```

---

## 🎯 SvelteKit Patterns

### Page Data Loading

```typescript
// +page.server.ts
export const load: PageServerLoad = async ({ params, locals }) => {
  const provider = await db.query.serviceProviderTable.findFirst({
    where: eq(serviceProviderTable.id, params.provider_id)
  });
  
  return {
    provider
  };
};
```

### Using Page Data

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
</script>

<h1>{data.provider.name}</h1>
```

### API Routes

```typescript
// +server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q');
  
  const results = await db.query.serviceProviderTable.findMany({
    where: like(serviceProviderTable.name, `%${query}%`)
  });
  
  return json({ results });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const data = await request.json();
  
  // Process data
  
  return json({ success: true });
};
```

---

## 🔔 Notifications

### Send Push Notification

```typescript
import { sendPushNotification } from '$lib/server/webpush';

await sendPushNotification({
  userId: user.id,
  title: 'Appointment Confirmed',
  body: 'Your appointment has been confirmed.',
  data: {
    url: '/appointments/123'
  }
});
```

### Create In-App Notification

```typescript
import { userNotificationTable } from '$lib/database/schema';

await db.insert(userNotificationTable).values({
  id: generateId(),
  userId: user.id,
  title: 'New Message',
  body: 'You have a new message.',
  status: 'unread'
});
```

---

## 🖼️ Image Upload (Cloudinary)

```typescript
import { uploadImage } from '$lib/server/cloudinary';

// In form action
export const actions: Actions = {
  upload: async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    const imageUrl = await uploadImage(file, {
      folder: 'avatars',
      transformation: {
        width: 400,
        height: 400,
        crop: 'fill'
      }
    });
    
    // Save imageUrl to database
  }
};
```

---

## 🔄 State Management

### Svelte Runes (Svelte 5)

```svelte
<script lang="ts">
  // Reactive state
  let count = $state(0);
  
  // Derived state
  let doubled = $derived(count * 2);
  
  // Effects
  $effect(() => {
    console.log('Count changed:', count);
  });
  
  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Count: {count} (Doubled: {doubled})
</button>
```

### Snippets (Svelte 5)

```svelte
<script>
  // Define snippet
</script>

{#snippet header()}
  <h1>Header Content</h1>
{/snippet}

{#snippet userCard(user)}
  <div class="card">
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </div>
{/snippet}

<!-- Use snippets -->
{@render header()}
{@render userCard({ name: 'John', email: 'john@example.com' })}
```

---

## 🛣️ Routing

### Dynamic Routes

```
routes/
  services/
    [service]/          → /services/osteopathy
      +page.svelte
      [provider_id]/    → /services/osteopathy/abc123
        +page.svelte
```

### Route Groups (no URL segment)

```
routes/
  (auth)/              → Groups auth routes, no /auth in URL
    login/
      +page.svelte     → /login (not /auth/login)
```

### Navigation

```svelte
<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
</script>

<!-- Link -->
<a href="/services/osteopathy">Services</a>

<!-- Button navigation -->
<button onclick={() => goto('/dashboard')}>
  Go to Dashboard
</button>

<!-- Current route -->
<p>Current path: {$page.url.pathname}</p>

<!-- Route params -->
<p>Service: {$page.params.service}</p>
```

---

## 🎨 Styling

### Tailwind CSS Classes

```svelte
<!-- Layout -->
<div class="flex items-center justify-between">
<div class="grid grid-cols-3 gap-4">
<div class="container mx-auto px-4">

<!-- Spacing -->
<div class="p-4 m-2 gap-4">
<div class="px-4 py-2 mx-auto">

<!-- Colors -->
<div class="bg-blue-500 text-white">
<div class="bg-gray-100 text-gray-900">

<!-- Typography -->
<h1 class="text-2xl font-bold">
<p class="text-sm text-gray-600">

<!-- Borders -->
<div class="border border-gray-300 rounded-lg">
<div class="border-t border-b">

<!-- Effects -->
<button class="hover:bg-gray-100 transition-colors">
<div class="shadow-lg rounded-xl">

<!-- Responsive -->
<div class="text-sm sm:text-base lg:text-lg">
<div class="hidden md:block">
```

### Dark Mode

```svelte
<!-- Will automatically switch based on user preference -->
<div class="bg-white dark:bg-gray-900">
  <p class="text-gray-900 dark:text-gray-100">Text</p>
</div>
```

---

## 🔧 Utilities

### Date Formatting

```typescript
// Format date from dd/mm/yyyy
export function friendlyDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  const date = new Date(+year, +month - 1, +day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Usage
friendlyDate('15/12/2024'); // "Dec 15, 2024"
```

### Generate ID

```typescript
import { encodeBase32 } from '@oslojs/encoding';

export function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return encodeBase32(bytes).toLowerCase();
}
```

### Time Utilities

```typescript
// Convert time string to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
```

---

## 🐛 Debugging

### Log to Console

```svelte
<script>
  let data = { name: 'John', age: 30 };
  
  // Log to browser console
  console.log('Data:', data);
  console.error('Error occurred');
  console.table(arrayOfObjects);
</script>

<!-- Debug in template -->
<pre>{JSON.stringify(data, null, 2)}</pre>
```

### SvelteKit Debugging

```typescript
// In +page.server.ts or +server.ts
console.log('[DEBUG] User:', locals.user);
console.log('[DEBUG] Params:', params);
console.log('[DEBUG] Query:', url.searchParams.toString());
```

### Database Query Debugging

```typescript
// Enable query logging in drizzle.config.ts
export default defineConfig({
  verbose: true,  // Logs all queries
  // ...
});
```

---

## 📦 Common Imports

```typescript
// SvelteKit
import { redirect, fail } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import type { PageServerLoad, Actions } from './$types';

// Database
import { db } from '$lib/database';
import { eq, and, or, like, gte, lte } from 'drizzle-orm';
import { userTable, serviceProviderTable } from '$lib/database/schema';

// Forms
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

// Auth
import { 
  validateSessionToken, 
  setSessionTokenCookie,
  generateSessionToken 
} from '$lib/server/auth/session';

// Components
import Button from '$lib/components/ui/button/button.svelte';
import Avatar from '$lib/components/ui/avatar/avatar.svelte';
import Input from '$lib/components/ui/form/input.svelte';
```

---

## 🚀 Deployment

### Environment Variables (Production)

Set these in Cloudflare Pages:

```
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-token
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_REDIRECT_URI=https://osteopaths.in/login/google/callback
CLOUDINARY_CLOUD_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
PUBLIC_BASE_URL=https://osteopaths.in
```

### Build and Deploy

```bash
npm run build        # Build for production
npm run preview      # Test production build locally
```

Cloudflare Pages automatically deploys on push to main branch.

---

## 📝 Code Snippets

### Protected Route Template

```typescript
// +page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) redirect(302, '/login/google');
  
  // Your data loading
  return {};
};
```

### Form Action Template

```typescript
// +page.server.ts
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(schema));
    if (!form.valid) return fail(400, { form });
    
    try {
      // Process form
      return message(form, 'Success!');
    } catch (error) {
      return fail(400, { form, error: String(error) });
    }
  }
};
```

### API Endpoint Template

```typescript
// +server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic
  
  return json({ data: results });
};
```

---

## 🔍 Common Issues & Solutions

### Issue: Module not found
**Solution**: `npm install` or restart dev server

### Issue: Type errors
**Solution**: `npm run check` to see all errors

### Issue: Database connection error
**Solution**: Check DATABASE_URL in .env

### Issue: Authentication not working
**Solution**: Verify Google OAuth credentials and redirect URI

### Issue: Styles not updating
**Solution**: Clear Tailwind cache: `rm -rf .svelte-kit`

---

**Keep this guide handy for quick reference during development!**

---

*Last Updated: December 10, 2024*
