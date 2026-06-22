# CodeAlpha_EcommerceStore

A production-ready MERN e-commerce store built for the CodeAlpha Full Stack Development Internship. It includes JWT authentication, role-based admin access, product management, cart persistence, checkout, order history, MongoDB Atlas integration, and a responsive Tailwind UI with dark mode.

## 1. Folder Structure

```text
CodeAlpha_EcommerceStore/
  backend/
    render.yaml
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      app.js
      server.js
      seed.js
  frontend/
    vercel.json
    src/
      api/
      components/
      context/
      pages/
      utils/
      App.jsx
      main.jsx
      index.css
```

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in `backend/.env`.

## 3. Database Models

- `User`: name, email, password, role, timestamps
- `Product`: title, description, image, category, price, stock, ratings, timestamps
- `Cart`: userId, products, quantity
- `Order`: userId, products, totalAmount, shippingAddress, orderStatus, paymentStatus, timestamps

## 4. APIs

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Products:
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin
- `PUT /api/products/:id` admin
- `DELETE /api/products/:id` admin

Cart:
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove`

Orders:
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

Admin:
- `GET /api/admin/stats`
- `GET /api/users`
- `PUT /api/users/:id/role`

## 5. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL=http://localhost:5000/api`.

## 6. Components

Reusable UI includes `Navbar`, `Footer`, `ProductCard`, `LoadingSkeleton`, `ProtectedRoute`, `AdminRoute`, and `StatCard`.

## 7. Pages

The app includes Home, Products, Product Details, Cart, Checkout, Login, Register, User Dashboard, Admin Dashboard, Order History, and 404 pages.

## 8. Authentication

Passwords are hashed with bcrypt. Login and registration return a JWT stored in localStorage. API requests use an Axios interceptor to attach `Authorization: Bearer <token>`. Admin routes are protected on both frontend and backend.

## 9. Cart Functionality

Guests use localStorage cart persistence. Authenticated users use the MongoDB-backed cart API. Users can add, remove, update quantities, and view subtotal/total calculations.

## 10. Order Processing

Checkout validates shipping information, converts cart items into an order, decrements product inventory, clears the cart, and exposes order history/status tracking.

## 11. Deployment Instructions

Backend on Render:
- Create a new Web Service.
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables from `backend/.env.example`
- Set `CLIENT_URL` to the deployed Vercel frontend URL.

Frontend on Vercel:
- Import the repository.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://your-render-api.onrender.com/api`

## Seed Data

After configuring MongoDB:

```bash
cd backend
npm run seed
```

Default admin:
- Email: `admin@codealpha.com`
- Password: `admin123`

Change the seeded password before using a public deployment.
