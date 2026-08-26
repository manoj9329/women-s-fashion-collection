Here is the complete Requirements Collection for your Women's Fashion Collection application:

---

## 📋 Requirements Collection

### 1. Project Overview
A full-stack e-commerce web application for a women's boutique shop that allows the owner to add dresses daily and customers to browse and purchase them online.

---

### 2. Functional Requirements

**Customer Side (Public)**
- View all available dresses on the homepage
- Browse dresses by category (Sarees, Kurtis, Dresses, Lehengas, Tops, Co-ords)
- Search dresses by name or category
- Sort products by newest, price low-high, price high-low, name A-Z
- View individual product details (name, price, sizes, colors, description)
- Select size and color before adding to cart
- Add products to shopping cart
- Update cart quantity and remove items
- View cart total with automatic shipping calculation
- Free shipping on orders above ₹1999
- Register a new customer account
- Login to existing account
- View order history
- Place orders with Razorpay payment gateway
- Order via WhatsApp button
- Receive toast notifications for actions

**Admin Side (Owner)**
- Secure login with email and password
- Dashboard with stats (total products, active listings, categories, inventory value)
- Add new dresses daily with:
  - Name, category, price, original price
  - Image URL
  - Sizes (XS, S, M, L, XL, XXL, Free Size)
  - Colors
  - Stock quantity
  - Badge (New, Sale, Hot)
  - Status (Active/Inactive)
  - Description
- Edit existing products
- Delete products
- View all customer orders
- Update order status (Pending, Paid, Processing, Shipped, Delivered, Cancelled)

---

### 3. Non-Functional Requirements

**Performance**
- Page load under 3 seconds (paid tier)
- API response under 500ms

**Security**
- JWT token-based authentication
- Password encryption using BCrypt
- Role-based access control (Customer, Admin)
- CORS protection

**Scalability**
- Cloud-hosted on Render
- PostgreSQL database
- Docker containerized

**Availability**
- 24/7 uptime (paid tier)
- Free tier sleeps after 15 min inactivity

---

### 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Java 21 + Spring Boot 3.2 |
| Database | PostgreSQL 18 |
| Authentication | JWT + Spring Security |
| Payment | Razorpay |
| Hosting | Render (Cloud) |
| Version Control | GitHub |
| Containerization | Docker |

---

### 5. Database Entities

| Entity | Description |
|---|---|
| User | Customer and admin accounts |
| Product | Dress listings with sizes, colors, stock |
| Order | Customer orders with status tracking |
| OrderItem | Individual items within each order |

---

### 6. API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/products | Public |
| GET | /api/products/{id} | Public |
| GET | /api/products/categories | Public |
| POST | /api/orders | Customer |
| POST | /api/orders/verify-payment | Customer |
| GET | /api/orders/my | Customer |
| GET | /api/admin/products | Admin |
| POST | /api/admin/products | Admin |
| PUT | /api/admin/products/{id} | Admin |
| DELETE | /api/admin/products/{id} | Admin |
| GET | /api/admin/orders | Admin |
| PUT | /api/admin/orders/{id}/status | Admin |

---

### 7. Live URLs

| Service | URL |
|---|---|
| Website | https://wfc-frontend.onrender.com |
| Backend API | https://women-s-fashion-collectionss.onrender.com |
| GitHub | https://github.com/manoj9329/women-s-fashion-collection |

---

### 8. User Roles

| Role | Access |
|---|---|
| Guest | Browse products, view details |
| Customer | Register, login, cart, orders, payment |
| Admin | Full access including product and order management |

---

### 9. Payment Flow
1. Customer adds items to cart
2. Enters shipping address
3. Clicks Pay with Razorpay
4. Razorpay payment gateway opens
5. Customer completes payment
6. Backend verifies payment signature
7. Order status updated to PAID
8. Customer redirected to orders page

---

### 10. Deployment Architecture

```
GitHub → Render (Auto Deploy)
         ├── wfc-backend (Docker + Spring Boot)
         ├── wfc-frontend (Static Site + React)
         └── womens-fashion-db (PostgreSQL)
```