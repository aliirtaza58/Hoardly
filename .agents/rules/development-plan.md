# Development Plan — E-Commerce Website

> **MANDATORY**: Read this entire document before doing any work on this project.
> This plan is the single source of truth for all development decisions.

---

## Architecture Overview

```
Frontend (React + Vite + Tailwind v3) --> Express.js API --> Supabase PostgreSQL
                                      --> Supabase Auth (JWT under the hood)
Deployed to: Vercel (frontend + serverless API)
Database: Supabase (managed PostgreSQL + Auth + Storage)
```

## Tech Stack (Finalized — do not change)

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | React Context + useReducer |
| Backend | Node.js + Express.js |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Hosting | Vercel |
| Version Control | GitHub |

## Database Schema

### users
- id (uuid PK, from Supabase Auth)
- email (text)
- full_name (text)
- phone (text)
- role (text: 'customer' | 'admin')
- created_at (timestamptz)
- updated_at (timestamptz)

### categories
- id (serial PK)
- name (text)
- slug (text, unique)
- description (text)
- image_url (text)
- parent_id (int FK -> categories.id, nullable)
- created_at (timestamptz)

### products
- id (serial PK)
- name (text)
- slug (text, unique)
- description (text)
- price (numeric)
- compare_at_price (numeric, nullable)
- stock_quantity (int)
- sku (text, unique)
- images (text[])
- category_id (int FK -> categories.id)
- is_active (boolean, default true)
- avg_rating (numeric, default 0)
- review_count (int, default 0)
- attributes (jsonb)
- created_at (timestamptz)
- updated_at (timestamptz)

### cart_items
- id (serial PK)
- user_id (uuid FK -> users.id)
- product_id (int FK -> products.id)
- quantity (int)
- created_at (timestamptz)
- updated_at (timestamptz)
- UNIQUE(user_id, product_id)

### orders
- id (serial PK)
- user_id (uuid FK -> users.id)
- order_number (text, unique)
- status (text: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled')
- subtotal (numeric)
- discount_amount (numeric, default 0)
- total (numeric)
- payment_method (text, default 'cod')
- shipping_address (jsonb)
- discount_code_id (int FK -> discount_codes.id, nullable)
- created_at (timestamptz)
- updated_at (timestamptz)

### order_items
- id (serial PK)
- order_id (int FK -> orders.id)
- product_id (int FK -> products.id)
- quantity (int)
- unit_price (numeric)
- total_price (numeric)

### addresses
- id (serial PK)
- user_id (uuid FK -> users.id)
- label (text: 'home' | 'work' | 'other')
- full_name (text)
- phone (text)
- address_line1 (text)
- address_line2 (text, nullable)
- city (text)
- state (text)
- postal_code (text)
- country (text)
- is_default (boolean, default false)
- created_at (timestamptz)

### wishlists
- id (serial PK)
- user_id (uuid FK -> users.id)
- product_id (int FK -> products.id)
- created_at (timestamptz)
- UNIQUE(user_id, product_id)

### reviews
- id (serial PK)
- user_id (uuid FK -> users.id)
- product_id (int FK -> products.id)
- rating (int, 1-5)
- title (text)
- body (text)
- is_verified_purchase (boolean, default false)
- created_at (timestamptz)
- updated_at (timestamptz)

### discount_codes
- id (serial PK)
- code (text, unique)
- type (text: 'percentage' | 'fixed')
- value (numeric)
- min_order_amount (numeric, nullable)
- max_uses (int, nullable)
- current_uses (int, default 0)
- is_active (boolean, default true)
- expires_at (timestamptz, nullable)
- created_at (timestamptz)

## API Endpoints

### Auth
- POST /api/auth/register (Public)
- POST /api/auth/login (Public)
- POST /api/auth/logout (User)
- POST /api/auth/forgot-password (Public)
- POST /api/auth/reset-password (Public)
- GET /api/auth/me (User)

### Products
- GET /api/products (Public — paginated, filtered, searched)
- GET /api/products/:slug (Public)
- GET /api/products/:id/reviews (Public)
- POST /api/products/:id/reviews (User)
- POST /api/products (Admin)
- PUT /api/products/:id (Admin)
- DELETE /api/products/:id (Admin)

### Categories
- GET /api/categories (Public)
- POST /api/categories (Admin)
- PUT /api/categories/:id (Admin)
- DELETE /api/categories/:id (Admin)

### Cart
- GET /api/cart (User)
- POST /api/cart (User)
- PUT /api/cart/:id (User)
- DELETE /api/cart/:id (User)
- DELETE /api/cart (User — clear all)

### Wishlist
- GET /api/wishlist (User)
- POST /api/wishlist (User)
- DELETE /api/wishlist/:productId (User)

### Orders
- POST /api/orders (User)
- GET /api/orders (User)
- GET /api/orders/:id (User)
- GET /api/admin/orders (Admin)
- PUT /api/admin/orders/:id/status (Admin)

### User Profile
- GET /api/users/profile (User)
- PUT /api/users/profile (User)
- GET /api/users/addresses (User)
- POST /api/users/addresses (User)
- PUT /api/users/addresses/:id (User)
- DELETE /api/users/addresses/:id (User)

### Admin
- GET /api/admin/products (Admin)
- GET /api/admin/orders (Admin)
- GET /api/admin/stats (Admin)

### Discount Codes
- POST /api/cart/apply-discount (User)
- GET /api/admin/discounts (Admin)
- POST /api/admin/discounts (Admin)
- PUT /api/admin/discounts/:id (Admin)
- DELETE /api/admin/discounts/:id (Admin)

## Folder Structure

```
E-Commerce Website/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/        # Button, Input, Modal, Loader
│   │   │   ├── layout/        # Navbar, Footer, Sidebar
│   │   │   ├── product/       # ProductCard, ProductGrid, ProductFilter
│   │   │   ├── cart/           # CartItem, CartSummary
│   │   │   ├── checkout/      # CheckoutForm, AddressForm
│   │   │   ├── auth/          # LoginForm, RegisterForm
│   │   │   ├── profile/       # ProfileForm, AddressList, OrderHistory
│   │   │   └── admin/         # AdminProductForm, OrderTable
│   │   ├── contexts/          # AuthContext, CartContext
│   │   ├── hooks/             # useProducts, useCart, useAuth
│   │   ├── pages/             # HomePage, ProductPage, CartPage
│   │   ├── services/          # API service layer (axios instances)
│   │   ├── utils/             # Formatters, validators, constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Tailwind directives + custom styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/            # Supabase client, env config
│   │   ├── middleware/        # auth, errorHandler, validate
│   │   ├── routes/            # auth, products, cart, orders, admin
│   │   ├── controllers/       # Business logic per route
│   │   ├── services/          # DB query layer (Supabase queries)
│   │   ├── utils/             # Helpers, email sender
│   │   ├── validators/        # Request validation schemas (Zod)
│   │   └── app.js             # Express app setup
│   ├── index.js               # Server entry point
│   └── package.json
├── database/
│   ├── migrations/            # SQL migration files
│   ├── seed.sql               # Sample data
│   └── schema.sql             # Full schema reference
├── .env.example
├── .gitignore
└── README.md
```

## Development Phases

### Phase 0 — Project Scaffolding & Infrastructure
- Initialize monorepo structure (/client + /server)
- Scaffold React app with Vite
- Install & configure Tailwind CSS v3
- Scaffold Express.js app
- Set up design token system (theme.css)
- Create .env.example files
- Set up ESLint + Prettier
- Initialize GitHub repo, push initial scaffold

### Phase 1 — Database & Auth Foundation
- Write SQL schema & run migrations on Supabase
- Configure Row-Level Security policies
- Set up Supabase Auth (email/password)
- Build Express auth middleware (verify Supabase JWT)
- Build admin role check middleware
- Create auth API routes
- Build React auth context (AuthContext)
- Build Login & Register pages with form validation
- Set up protected route wrapper
- Seed database with sample data

### Phase 2 — Core Product Experience
- Product API (list, search, filter, paginate)
- Category API
- ProductCard, ProductGrid, ProductFilter components
- Search bar with debounced API calls
- Home Page (hero, featured categories, featured products)
- Product Listing Page (grid + filters + sort + pagination)
- Product Detail Page (images, description, add to cart, reviews)
- Navbar and Footer

### Phase 3 — Cart & Wishlist
- Cart API (CRUD)
- CartContext for global cart state
- Cart Page (item list, quantity controls, remove, subtotal)
- Cart icon badge in navbar
- Wishlist API and Wishlist Page

### Phase 4 — Checkout & Orders
- Address form component
- Checkout Page (address, order summary, discount code, COD)
- Discount code validation API
- Order placement API
- Order Confirmation Page
- Order History and Order Detail pages
- Email notifications

### Phase 5 — User Profile & Reviews
- Profile Page (edit name, email, phone, password)
- Address Management
- Product review/rating system API
- ReviewForm and ReviewList components

### Phase 6 — Admin Dashboard
- Admin route protection (role-based)
- Admin Layout with sidebar
- Dashboard stats cards
- Product Management (CRUD table)
- Order Management (table + status update)
- Discount Code Management

### Phase 7 — Polish, UX & Responsive Design
- Loading skeletons, empty states, error boundaries, toasts
- Micro-animations, page transitions
- Responsive pass (tablet & mobile)
- SEO (meta tags, semantic HTML)
- Accessibility pass
- Performance optimization

### Phase 8 — Testing & Bug Fixes
- End-to-end manual testing
- Edge case testing
- API error handling review
- Security review
- Code cleanup and documentation

### Phase 9 — Deployment & Go-Live
- Configure Vercel project
- Set up environment variables
- Configure Supabase production
- Production build and verification
- Database backups
- Final smoke test

## Git Workflow

```
main <- production (deployed to Vercel)
  └── dev <- all feature merges here first
       ├── feature/phase-0-scaffold
       ├── feature/phase-1-auth
       ├── feature/phase-2-products
       └── ... (one branch per phase)
```

Push after each sub-task is reviewed and working. Roughly every 1-2 hours of work.
