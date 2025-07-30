# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a next.js app built to showcase all the features of Atlas (https://docs.runonatlas.com/developer-portal/sdk/next). This app is built to be a simple example of how to use the Atlas SDK to build and monitize a web app. We will approach building this app in multiple phases. Starting with Phase 1

## Phase 1 ✅ COMPLETED

Create very basic next.js app with a single page that displays "Hello World". Make sure to include the atlas sdk and initialize it with your Atlas API key. The app should have no features, and no pricing page nor a customer portal to start. Once this is complete the user will add phase 2.

**Completed Features:**
- Next.js app with TypeScript and Tailwind CSS
- Atlas SDK integration with proper client/server setup
- Three buttons with Atlas UI protection using FeatureProtect
- Mock authentication system with login screen
- User selection: user1, user2, user3 with different plan types

## Mock Authentication System

The app includes a mock authentication system for testing Atlas features:

**Available Test Users:**
- **user1**: Basic plan user (user1@example.com)
- **user2**: Premium plan user (user2@example.com)  
- **user3**: Enterprise plan user (user3@example.com)

**Authentication Flow:**
1. Login screen appears first with user selection
2. Click any user card to login
3. User data is passed to Atlas SDK for feature management
4. Logout button available in top-right corner
5. User state persists in localStorage

**Files:**
- `src/lib/mock-auth.tsx` - Authentication context and logic
- `src/components/login-screen.tsx` - Login UI component
- `src/atlas/client.tsx` - Atlas client with mock auth integration
- `src/atlas/server.ts` - Atlas server with mock token parsing

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Configuration

- Atlas SDK is configured in `src/app/providers.tsx`
- Environment variables in `.env.local` (set NEXT_PUBLIC_ATLAS_API_KEY)
- TypeScript configuration in `tsconfig.json`

## Phase 2

To come soon.

This CLAUDE.md file should be updated as the project develops to provide better guidance for future Claude Code sessions.