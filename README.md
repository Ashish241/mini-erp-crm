# Mini ERP / CRM MVP

A focused MVP for a mini ERP system covering the critical sales workflow:
**Login → Customer/Product setup → Create Challan → Confirm Challan → Stock Decreases**

## Features

- **Role-based Authentication**: JWT-based login with Admin, Sales, Warehouse, and Accounts roles.
- **Customer CRM**: Manage customers, track statuses (Lead, Active, Inactive), and log follow-up notes.
- **Product & Stock Management**: Track products, SKUs, pricing, and stock levels. Real-time low stock indicators.
- **Sales Challans**: Create draft challans with multiple items. Confirming a challan automatically verifies and deducts stock within a database transaction.
- **Responsive Dashboard**: Dark-themed, modern glassmorphism UI with real-time stats.

## Architecture & Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Frontend**: React 18, Vite, TypeScript, React Router
- **Styling**: Plain CSS with modern design system (Custom Properties, Flexbox/Grid)

## Database Schema Summary

The database uses PostgreSQL and contains the following models:
- `User`: Handles authentication and roles.
- `Customer`: Stores client details and CRM status.
- `FollowUp`: Logs interactions with customers.
- `Product`: Stores product info, SKU, price, and current stock.
- `StockMovement`: Logs all IN/OUT inventory adjustments.
- `Challan` & `ChallanItem`: Stores sales orders.

## Local Setup

### 1. Database Configuration
You need a PostgreSQL database. Set the connection string in `backend/.env`.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mini_erp"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 3. Frontend Setup

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
cd frontend
npm install
npm run dev
```

## Seed Credentials

The database seed provides 4 test users:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin@123 |
| Sales | sales@example.com | Sales@123 |
| Warehouse | warehouse@example.com | Warehouse@123 |
| Accounts | accounts@example.com | Accounts@123 |

## Role Permissions

| Role | Permissions |
|---|---|
| **Admin** | Full access to all modules. |
| **Sales** | View/Manage Customers, Follow-ups, and Challans. |
| **Warehouse** | View/Manage Products and Stock Movements. |
| **Accounts** | View-only access to Customers, Products, and Challans. |

## API Endpoints

- **Auth**: `POST /api/auth/login`, `GET /api/auth/me`
- **Customers**: `GET /api/customers`, `POST /api/customers`, `PUT /api/customers/:id`, `POST /api/customers/:id/follow-ups`
- **Products**: `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `POST /api/products/:id/stock`
- **Challans**: `GET /api/challans`, `POST /api/challans`, `POST /api/challans/:id/confirm`, `POST /api/challans/:id/cancel`
- **Dashboard**: `GET /api/dashboard/stats`

## Assumptions & Known Limitations

- **MVP Scope**: This is an MVP. Features like PDF invoice generation, email notifications, and deep reporting are not included.
- **Stock Movements**: Currently, confirming a challan deducts stock. Canceling a confirmed challan (return process) is not yet implemented.
- **Pagination**: Basic offset pagination is implemented on the backend.
- **Security**: In production, ensure HTTPS is used for all endpoints and adjust CORS settings in Express.

## Deployment Instructions

### Database
Deploy PostgreSQL on a service like Neon, Supabase, or Railway. Update the `DATABASE_URL` in your production environment.
Run `npx prisma migrate deploy` to apply migrations.

### Backend (Render / Railway)
Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV=production`.
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start`

### Frontend (Vercel / Netlify)
Set environment variables: `VITE_API_URL=https://your-backend.com/api`.
- Build Command: `npm run build`
- Output Directory: `dist`
