# 👑 The Karyakram Manager

[![Live Demo](https://img.shields.io/badge/Live_Demo-Access_Platform-purple.svg?style=for-the-badge)](https://karyakram-manager-96844255033.us-central1.run.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Deployed-4285F4.svg?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/run)

**The Karyakram Manager** is a premium, full-scale event coordination platform designed for elegant, real-time command over complex events. Built with an "Imperial Night" theme, it empowers Administrators, Event Staff, and Attendees to interact frictionlessly through specialized dashboards.

## ✨ Key Features

### 👑 Admin / Host Command Center
*   **Total Event Control**: Provision events, zones, capacity limitations, and schedules.
*   **Live Personnel Map**: View the real-time geographical distribution of your staff across event venues.
*   **Royal Dispatch System**: Broadcast "Standard", "Urgent", or "Emergency" push notifications directly to attendee or staff inboxes.
*   **Staff Orchestration**: Assign duties securely. Staff can securely view and accept/decline tasks in their isolated duty portal.

### 💂 Staff Portal
*   **Secure Invitations**: Receive encrypted role invitations.
*   **Duty Logging**: Track assigned check-ins, VIP area monitoring, and security shifts.
*   **Rapid Check-In Scanners**: Perform QR authentication for attendees entering designated zones.

### 🎫 Attendee Experience
*   **Seamless Registration**: Dynamic ticket issuance complete with cryptographic QR codes.
*   **Personal Itinerary**: Direct access to booked event schedules and location mapping.
*   **Live Broadcast Inbox**: Centralized hub for absorbing dispatch alerts issued by the Host.

---

## 🛠️ Technology Architecture

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router format for server-side generation)
*   **Database**: PostgreSQL
*   **ORM / Data Layer**: [Prisma](https://www.prisma.io/) 
*   **Authentication**: NextAuth.js (Session & Role-based Access Control)
*   **Styling**: Pure Modular CSS with a "Violet & Mustard Yellow" theme architecture.
*   **Infrastructure**: Fully containerized via Docker and deployed serverlessly utilizing Google Cloud Run.

---

## 💻 Local Development

### 1. Prerequisites
Ensure you have Node.js (v20+ recommended) and a PostgreSQL instance running locally.

### 2. Environment Variables
Create a `.env` file at the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/karyakram_db"
NEXTAUTH_SECRET="your-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 3. Installation & Run
```bash
# Install dependencies
npm install

# Initialize Prisma & migrate database schema
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

---

## 🚀 Cloud Deployment

This platform uses an **Atomic Deployment** strategy targeting Google Cloud Run.

```bash
# Push directly from source to Cloud Run
gcloud run deploy karyakram-manager \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```
 *Note: Ensure your `DATABASE_URL` is pointing to your connected Cloud SQL PostgreSQL instance in your target Google Cloud Project.*

---
*Created by Rasika.*