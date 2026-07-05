# Laxmi Path Lab — Pathology Lab Management System

A full-stack MERN application for managing pathology lab operations: patients, doctors,
tests, appointments, sample tracking, reports, billing, inventory, and staff.

## Stack
- **Frontend:** React 19 + Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Framer Motion, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, PDFKit, QRCode, Nodemailer, Multer
- **Auth roles:** Super Admin, Admin, Receptionist, Lab Technician (JWT + RBAC on every protected route)

## What's included (fully working)
- JWT authentication: login, forgot/reset password, change password, role-based route protection
- Patient CRUD with search/filter/pagination, auto-generated Patient ID + QR code
- Doctor management with referral tracking and commission %
- Test catalog CRUD (15 default tests seeded)
- Appointment booking (walk-in / online / home collection) — auto-generates sample records per test
- Sample tracking with status pipeline (Pending → Collected → Processing → Completed)
- Report creation with parameter-level results, PDF generation (PDFKit), email delivery, QR verification code
- Invoicing with GST + discount calculation, multi-mode payment recording, payment status tracking
- Inventory management with low-stock flagging
- Staff management (creates a User + Staff record), attendance/leave endpoints
- In-app notifications
- Lab settings (name, logo, GST, report header/footer)
- Analytics dashboard: patient/revenue/report stats, revenue trend chart, top tests, payment status breakdown, recent activity
- Dark/light mode, responsive sidebar layout, toast notifications, skeleton loading states

## What's stubbed / next steps
The spec you provided is genuinely enterprise-scale (Cloudinary uploads, SMS/WhatsApp integration,
Excel/CSV export, digital signatures, audit log UI, barcode scanning hardware, staff attendance UI,
appointment calendar view, home-collection routing) — these have backend models/fields ready
(e.g. `AuditLog`, `Notification.channel`, `Sample.barcode`) but no dedicated UI screens yet.
Follow the same controller/route/page pattern already in place to add them.

## Getting started

### 1. Backend
```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI, JWT_SECRET, SMTP, Cloudinary, etc.
npm install
npm run seed               # creates Super Admin + default tests + default settings
npm run dev                 # starts on http://localhost:5000
```
Default Super Admin after seeding: `superadmin@laxmipathlab.com` / `Admin@12345`
**Change this password immediately in production.**

### 2. Frontend
```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts on http://localhost:5173
```

### 3. MongoDB
Use a local MongoDB instance or MongoDB Atlas. Update `MONGO_URI` in `backend/.env` accordingly.

## Project structure
```
laxmi-path-lab/
├── backend/
│   └── src/
│       ├── config/        # db, cloudinary, mailer
│       ├── models/        # 14 Mongoose schemas
│       ├── controllers/   # business logic per module
│       ├── routes/        # REST endpoints, RBAC-protected
│       ├── middleware/    # auth, error handling, validation, upload
│       └── utils/         # token/id/QR/PDF generators, seed script
└── frontend/
    └── src/
        ├── components/    # ui/ (Button, Card, Table, Modal...) and layout/ (Sidebar, Navbar)
        ├── context/       # AuthContext, ThemeContext
        ├── pages/         # one folder per module
        └── lib/api.js     # axios client with JWT interceptor
```

## Deployment
- **Frontend:** Vercel / Netlify — set `VITE_API_URL` to your deployed backend URL
- **Backend:** Render / Railway / AWS EC2 — set all `.env` vars, especially `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
- **Database:** MongoDB Atlas
