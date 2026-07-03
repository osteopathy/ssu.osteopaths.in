# Getting Started - Osteopaths.in Platform

Welcome to the Osteopaths.in platform development! This guide will help you set up your development environment and understand the project structure.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 23.x or higher
  - Check: `node --version`
  - Download: https://nodejs.org/
- **npm**: Version 10.x or higher (comes with Node.js)
  - Check: `npm --version`
- **Git**: For version control
  - Check: `git --version`
  - Download: https://git-scm.com/

---

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/osteopathy/osteopaths.in.git
cd osteopaths.in
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`.

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database (Turso)
DATABASE_URL="file:local.db"  # For local development
# DATABASE_URL="libsql://your-db.turso.io"  # For production
DATABASE_AUTH_TOKEN=""  # Leave empty for local SQLite

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:5173/login/google/callback"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Web Push Notifications
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
VAPID_SUBJECT="mailto:your-email@example.com"

# Application
PUBLIC_BASE_URL="http://localhost:5173"
```

### 4. Set Up the Database

Initialize your local SQLite database:

```bash
# Generate migration files (if schema changed)
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Your application should now be running at http://localhost:5173

---

## 🗂️ Project Structure

```
osteopaths.in/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # Base UI components (button, form, etc.)
│   │   │   ├── dialogs/         # Modal dialogs
│   │   │   └── *.svelte         # Other components
│   │   ├── database/            # Database configuration
│   │   │   ├── schema/          # Database schema definitions
│   │   │   │   ├── user/        # User-related tables
│   │   │   │   ├── service/     # Service-related tables
│   │   │   │   ├── student/     # Student tables
│   │   │   │   └── notification/ # Notification tables
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── index.ts         # Database client
│   │   ├── server/              # Server-side utilities
│   │   │   ├── auth/            # Authentication logic
│   │   │   ├── cloudinary.ts    # Image upload
│   │   │   └── webpush.ts       # Push notifications
│   │   ├── icons/               # SVG icon components
│   │   └── utils/               # Utility functions
│   ├── routes/
│   │   ├── (auth)/              # Authentication routes
│   │   │   └── login/
│   │   ├── (api)/               # API endpoints
│   │   │   ├── api/v1/          # API version 1
│   │   │   └── admin/           # Admin routes
│   │   ├── (static)/            # Static pages
│   │   ├── services/            # Service browsing and booking
│   │   │   └── [service]/       # Dynamic service routes
│   │   ├── service_provider/    # Provider management
│   │   ├── [user_id]/           # User profile routes
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +layout.server.ts    # Server-side layout data
│   │   └── +page.svelte         # Landing page
│   ├── app.html                 # HTML template
│   ├── app.css                  # Global styles
│   └── hooks.server.ts          # SvelteKit hooks
├── static/                      # Static assets (images, fonts, etc.)
├── tests/                       # Test files (to be created)
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment file
├── package.json                 # Dependencies and scripts
├── svelte.config.js             # SvelteKit configuration
├── vite.config.ts               # Vite configuration
├── drizzle.config.ts            # Drizzle ORM configuration
├── tsconfig.json                # TypeScript configuration
├── CODEBASE_SUMMARY.md          # Detailed codebase documentation
├── ROADMAP.md                   # Development roadmap
└── README.md                    # Project overview
```

---

## 🔧 Common Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run check            # Type-check TypeScript
npm run lint             # Run linter
npm run format           # Format code with Prettier
```

### Database
```bash
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate migration files
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio (visual DB client)
```

---

## 🎯 First Steps for New Developers

### 1. Understand the Core Workflow

Read through these files to understand how the platform works:

1. **Authentication**: `src/lib/server/auth/session.ts`
2. **Database Schema**: `src/lib/database/schema/index.ts`
3. **Main Booking Flow**: `src/routes/services/[service]/[service_provider_id]/+page.svelte`
4. **Provider Management**: `src/routes/service_provider/`

### 2. Review Documentation

- **CODEBASE_SUMMARY.md**: Comprehensive overview of the codebase
- **ROADMAP.md**: Development plan and future features
- **README.md**: Project overview and tech stack

### 3. Set Up Your IDE

#### VS Code (Recommended)

Install these extensions:
- Svelte for VS Code
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

Settings are already configured in `.vscode/settings.json`.

### 4. Run the Database Studio

To visually explore the database:

```bash
npm run db:studio
```

This opens a web interface at http://local.drizzle.studio where you can:
- View all tables
- Browse data
- Run queries
- Test relationships

---

## 🔐 Setting Up OAuth for Development

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:5173/login/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

---

## 🗄️ Understanding the Database

### Core Tables

- **user**: All platform users
- **user_session**: Authentication sessions
- **service**: Service types (osteopathy, etc.)
- **service_provider**: Provider profiles
- **service_provider_date_wise_schedule**: Provider availability
- **service_provider_appointment_request**: Booking requests
- **service_provider_appointment**: Confirmed appointments
- **service_subscription**: User subscriptions to providers
- **student**: Student-specific data
- **user_notification**: Notification messages

### Key Relationships

```
User → UserSession (1:many)
User → Student (1:1)
User → ServiceProvider (1:many)
User → Appointments (1:many)

Service → ServiceProvider (1:many)

ServiceProvider → DateWiseSchedule (1:many)
ServiceProvider → AppointmentRequest (1:many)
ServiceProvider → Appointment (1:many)
```

---

## 🎨 UI Components

### Using Components

```svelte
<script>
  import Button from '$lib/components/ui/button/button.svelte';
  import Avatar from '$lib/components/ui/avatar/avatar.svelte';
</script>

<Button variant="default" size="lg">Click Me</Button>
<Avatar src="/path/to/image.jpg" alt="User" fallback="JD" />
```

### Available Components

- **Button**: `$lib/components/ui/button/button.svelte`
- **Avatar**: `$lib/components/ui/avatar/avatar.svelte`
- **Form Inputs**: `$lib/components/ui/form/`
- **Typography**: `$lib/components/ui/typography/`
- **Dialogs**: `$lib/components/dialogs/`

### Styling with Tailwind

All components use Tailwind CSS 4.0:

```svelte
<div class="flex items-center gap-4 rounded-lg bg-gray-100 p-4">
  <h1 class="text-2xl font-bold">Hello World</h1>
</div>
```

---

## 🧪 Testing (Coming Soon)

Testing infrastructure is planned but not yet implemented. See ROADMAP.md Phase 2.2 for details.

When implemented, you'll be able to:
```bash
npm run test           # Run all tests
npm run test:unit      # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e       # Run end-to-end tests
```

---

## 📝 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code following existing patterns
- Use TypeScript for type safety
- Follow the component structure
- Add comments for complex logic

### 3. Test Your Changes

```bash
npm run dev          # Test in browser
npm run check        # Type-check
npm run lint         # Check for issues
npm run format       # Format code
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow commit conventions:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is in use:
```bash
npm run dev -- --port 3000
```

### Database Issues

Reset your local database:
```bash
rm local.db  # Delete existing database
npm run db:push  # Recreate from schema
```

### Node Version Issues

Use the correct Node version:
```bash
# If using nvm (Node Version Manager)
nvm use 23
```

### Module Not Found

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learning Resources

### SvelteKit
- [Official Tutorial](https://learn.svelte.dev/)
- [Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 (Runes)](https://svelte.dev/docs/svelte/what-are-runes)

### Drizzle ORM
- [Documentation](https://orm.drizzle.team/docs/overview)
- [SQLite Guide](https://orm.drizzle.team/docs/get-started-sqlite)

### TypeScript
- [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript in 5 Minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

### Tailwind CSS
- [Documentation](https://tailwindcss.com/docs)
- [Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

## 🤝 Getting Help

- **Documentation**: Check CODEBASE_SUMMARY.md and ROADMAP.md
- **Code Questions**: Comment on GitHub issues
- **Bugs**: Create a new issue on GitHub
- **Team Chat**: [Your team communication channel]

---

## ✅ Checklist for First Day

- [ ] Clone repository
- [ ] Install Node.js 23+
- [ ] Run `npm install`
- [ ] Create `.env` file with database config
- [ ] Run `npm run db:push`
- [ ] Start dev server with `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Read CODEBASE_SUMMARY.md
- [ ] Read ROADMAP.md
- [ ] Explore database with `npm run db:studio`
- [ ] Review a few key files:
  - [ ] `src/routes/+page.svelte`
  - [ ] `src/lib/database/schema/index.ts`
  - [ ] `src/lib/server/auth/session.ts`
- [ ] Make a small test commit

---

## 🎉 You're Ready!

You now have a working development environment. Here are some suggested first tasks:

### Beginner Tasks
1. Fix a small UI bug
2. Add a new icon component
3. Update a static page
4. Improve error messages

### Intermediate Tasks
1. Add a new form validation
2. Create a new UI component
3. Add a database query
4. Implement a new API endpoint

### Advanced Tasks
1. Work on service configuration system (Phase 2)
2. Set up testing infrastructure
3. Implement payment integration
4. Build new dashboard features

---

**Welcome to the team! Let's build something amazing together! 🚀**

---

*Last Updated: December 10, 2024*
