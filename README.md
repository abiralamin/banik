# Banik — Street Vendor Management System

Banik is a full-stack platform for managing street vendors, vending zones, license
applications, payments, complaints, and administrative operations, built as a
university software engineering project.

## Technology Stack

| Layer    | Technology                                                                                 |
| -------- | ------------------------------------------------------------------------------------------ |
| Frontend | React (Vite), Tailwind CSS, React Router, Axios                                            |
| Backend  | Spring Boot 4, Spring Web, Spring Data JPA/Hibernate, Spring Security, JWT, Maven, Java 21 |
| Database | MySQL                                                                                      |
| Email    | Standalone Node.js + Express + Nodemailer microservice                                     |
| Extras   | ZXing (QR code generation)                                                                 |

## Architecture

```
React + Tailwind (Frontend)  ──REST/JWT──►  Spring Boot API (Backend)  ──JDBC──►  MySQL
                                                  │
                                                  └──HTTP──►  Node.js + Nodemailer (EmailService)
```

Nodemailer only runs on Node.js, so email sending (OTP verification, notifications) is
implemented as a small standalone Express microservice. The Spring Boot backend calls it
over HTTP (`app.email-service.base-url`) instead of embedding a Node runtime inside the JVM app.

## Project Structure

```
Banik/
├── Backend/       Spring Boot REST API (Java 21, Maven)
├── Frontend/      React + Tailwind CSS SPA
├── Database/      MySQL SQL scripts (schema, seed data, indexes)
└── EmailService/  Node.js + Nodemailer microservice
```

## Features Implemented

- Vendor registration with email OTP verification (expiring, single-use, resend supported)
- Vendor login, Admin login (seeded default admin), forgot/reset password via OTP
- Vendor profile management (editable, profile completion %, change password, deactivation request)
- Public pages: Home, About, Features, Vending Zones map (list + filter + detail modal), FAQ
- 7-step license application workflow (personal info → business info → zone selection →
  license type & pricing → document upload → review → dummy/pay-later fee payment)
- Multiple licenses per vendor across different zones (no 1:1 vendor–license constraint)
- Application status tracking with history, withdraw option
- Admin application review queue (filter/search/sort), approve/reject/request-info, bulk actions
- Digital license issuance with auto-generated license number + QR code (ZXing), print/download
- License renewal (1/3/6/12 months) with early-bird discount calculation, auto-renew toggle
- Complaint submission (category, priority, anonymous option) with tracking number,
  vendor follow-up/close/escalate, admin queue with status actions
- Zone management (admin CRUD, public read-only listing with live occupancy status)
- Vendor & Admin dashboards with live stats
- Centralized error handling with user-friendly messages, JWT-secured role-based APIs

Notification center, announcements, feedback, and women's-vendor-support modules have
their database tables and entities scaffolded (see `Database/02_create_tables.sql`) but
are not yet wired up to dedicated APIs/pages — see "Next Steps" below.

## Prerequisites

- Java 21 (JDK)
- Maven (or use the included `mvnw`/`mvnw.cmd` wrapper)
- Node.js 18+ and npm
- MySQL 8+

## 1. Database Setup

```powershell
mysql -u root -p < Database/01_create_database.sql
mysql -u root -p < Database/02_create_tables.sql
mysql -u root -p < Database/03_insert_demo_data.sql
mysql -u root -p < Database/04_create_indexes.sql
```

Update `Backend/src/main/resources/application.properties` with your MySQL username/password
if different from the defaults (`root` / `mysql123`).

> Demo users (admin + a sample vendor) are seeded automatically by the backend on first
> startup (`DataSeeder.java`) so their passwords are properly hashed — you do not need to
> insert them via SQL.

## 2. Backend Setup

```powershell
cd Backend
./mvnw.cmd spring-boot:run
```

The API starts on `http://0.0.0.0:8080` (bound to all interfaces for LAN/mobile access).

### Environment variables (override via OS env vars or `application.properties`)

| Variable                     | Purpose                                       | Default                   |
| ---------------------------- | --------------------------------------------- | ------------------------- |
| `APP_CORS_ALLOWED_ORIGINS`   | Comma-separated allowed frontend origins      | `http://localhost:5173`   |
| `APP_JWT_SECRET`             | JWT signing secret (**change in production**) | placeholder — change this |
| `APP_JWT_EXPIRATION_MS`      | JWT token lifetime                            | `86400000` (24h)          |
| `APP_ADMIN_DEFAULT_PASSWORD` | Initial admin password                        | `admin123`                |
| `APP_UPLOAD_DIR`             | Directory for uploaded files                  | `uploads`                 |
| `APP_EMAIL_SERVICE_URL`      | Base URL of the Node email microservice       | `http://localhost:4000`   |

## 3. Email Service Setup

```powershell
cd EmailService
copy .env.example .env
# edit .env with your SMTP credentials (e.g. Gmail App Password)
npm install
npm start
```

The service listens on port `4000` and exposes `/send-otp` and `/send-notification`,
called internally by the backend. If the email service is unreachable, backend requests
still succeed (email sending fails silently and is logged) so development isn't blocked.

## 4. Frontend Setup

```powershell
cd Frontend
npm install
npm run dev
```

Configure the API URL in `Frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

## 5. Mobile / Multi-Device Access (Same Wi-Fi)

1. Find your PC's LAN IP address (Windows: `ipconfig`, look for the Wi-Fi adapter's IPv4 address, e.g. `192.168.1.20`).
2. Update `Frontend/.env`:
   ```
   VITE_API_BASE_URL=http://192.168.1.20:8080
   ```
3. Update `Backend`'s CORS to allow your frontend's LAN origin:
   ```
   APP_CORS_ALLOWED_ORIGINS=http://192.168.1.20:5173
   ```
4. Restart both frontend and backend, then on your phone (same Wi-Fi) open:
   `http://192.168.1.20:5173`
5. Make sure Windows Firewall allows inbound connections on ports 5173 and 8080.

The backend already binds to `0.0.0.0` and the Vite dev server is configured with
`server.host = '0.0.0.0'`, so no code changes are needed — only the environment variables above.

## Demo Credentials

| Role   | Login                | Password     |
| ------ | -------------------- | ------------ |
| Admin  | `admin`              | `admin123`   |
| Vendor | `vendor@banik.local` | `Vendor@123` |

**Change the default admin password** after first login via Vendor/Admin profile →
Change Password (the same endpoint pattern is used; wire an admin profile page to
`POST /api/vendor/profile/change-password`-style endpoint if a dedicated admin settings
UI is added).

## Troubleshooting

- **CORS errors in the browser**: ensure `APP_CORS_ALLOWED_ORIGINS` includes the exact
  origin (scheme + host + port) the frontend is served from.
- **401 Unauthorized on every request**: the JWT may have expired — log in again.
- **OTP email never arrives**: check `EmailService` logs/`.env` SMTP credentials; for Gmail,
  you must use an **App Password**, not your account password.
- **`ECONNREFUSED` to MySQL**: confirm MySQL is running and credentials in
  `application.properties` are correct.
- **Cannot access from phone**: confirm both devices are on the same Wi-Fi network and
  Windows Firewall isn't blocking ports 5173/8080.

## Next Steps (Not Yet Implemented)

- Notification center UI + admin notification composer (tables/entities already exist)
- Announcements, FAQ admin management, feedback/support ticket UIs
- Women vendor support (community forum, safety info) pages
- Inspection scheduling UI, activity log viewer, reports & analytics dashboards/charts
- Automated tests (backend integration tests, frontend component tests)
