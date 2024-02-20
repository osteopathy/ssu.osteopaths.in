<p align="center">
  Appointment booking platform
</p>

## Introduction

A Online Platform for making it easy for people to find and book osteopathy appointments online.

## Features
- Effective UI
- Dark Mode
- Username
	`/priyan` -> checks for priyan username and respective user_id for it, from the upstash redis, and then fetches data from database of that user
- Profile Pic, Upload using cloudinary
- Lazy loading
- Performant
- Google Auth
- Google Calendar Integration
- Users can book Appointment
- Availability ( soon )
- Osteopath's can edit appointments

## Tech Stack + Features

### Frameworks

- [Sveltekit](https://kit.svelte.dev) – Svelte-Kit is full-stack framework for building Svelte apps with server-side rendering, file-based routing, and more.
- [Lucia](https://lucia-auth.com) – Handle user authentication with ease with providers like Google, Twitter, GitHub, etc.
- [Drizzle](https://orm.drizzle.team) – Headless Typescript ORM

### Platforms

- [TursoDB](https://turso.tech/) – Simple, Cost Efficient and Scalable Database
- [Upstash](https://upstash.com) - Serverless Redis

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn Svelte](https://shadcn-svelte.com/) – Primitives like modal, popover, etc. to build a stellar user experience
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons

### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript

### File Structure

#### Routes and Pages

- `src/routes` – Sveltekit routes
	- `src/google` - Continue with Google Screen main UI
		- `src/google/callback` - API Endpoint for Callback
		- `src/google/login` - API Endpoint for Generate Auth URL
		- `src/google/logout` - API Endpoint for Logout
