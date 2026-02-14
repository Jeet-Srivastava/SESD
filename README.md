# Smart Campus Complaint Management System

## Local setup

0. Use Node.js `20.x` or `22.x` LTS. Avoid Node `23.x` for this project because the MongoDB Node driver officially supports Active LTS releases.
1. Install dependencies with `npm install`.
2. Copy backend env values with `cp apps/backend/.env.example apps/backend/.env`.
3. Copy frontend env values with `cp apps/frontend/.env.example apps/frontend/.env`.
4. Make sure MongoDB is reachable from your machine.
5. Run the apps with `npm run dev`.

## Required values from your side

- `MONGODB_URI`: your MongoDB connection string.
- `JWT_SECRET`: any secret string with at least 16 characters.
- `VITE_API_BASE_URL`: only needed if your backend is not running at `http://localhost:4000/api`.

## Admin and staff accounts

Public registration is student-only. To create admin and staff users, run this from the repo root:

```bash
cd apps/backend
SEED_ADMIN_NAME="Campus Admin" \
SEED_ADMIN_EMAIL="admin@example.com" \
SEED_ADMIN_PASSWORD="adminpassword123" \
SEED_STAFF_NAME="Maintenance Staff" \
SEED_STAFF_EMAIL="staff@example.com" \
SEED_STAFF_PASSWORD="staffpassword123" \
npm run seed:users
```

You can provide only the admin values or only the staff values if needed.

## Verification

- Typecheck: `npm run lint`
- Build: `npm run build`
- Tests: `npm test`
