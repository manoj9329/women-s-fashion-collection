# Women's Fashion Collection — Full Stack App

## Tech Stack
- **Backend:** Java 21 + Spring Boot 3.2 + Spring Security (JWT)
- **Database:** PostgreSQL
- **Frontend:** React 18 + Vite
- **Payment:** Razorpay
- **Hosting:** Railway (recommended)

---

## Project Structure
```
wfc/
├── backend/          ← Spring Boot app
│   ├── src/main/java/com/wfc/
│   │   ├── entity/       (User, Product, Order, OrderItem)
│   │   ├── repository/   (JPA repositories)
│   │   ├── service/      (business logic)
│   │   ├── controller/   (REST APIs)
│   │   ├── security/     (JWT filter + util)
│   │   ├── config/       (Security config, DataSeeder)
│   │   └── dto/          (request/response DTOs)
│   └── src/main/resources/application.properties
└── frontend/         ← React + Vite app
    └── src/
        ├── api/      (axios client)
        ├── context/  (Auth + Cart context)
        ├── components/ (Navbar, ProductCard)
        └── pages/    (Home, Shop, Cart, Auth, Orders, Admin)
```

---

## LOCAL SETUP

### 1. PostgreSQL
```sql
CREATE DATABASE wfc_db;
```

### 2. Backend
```bash
cd backend
# Edit src/main/resources/application.properties:
# spring.datasource.username=YOUR_PG_USERNAME
# spring.datasource.password=YOUR_PG_PASSWORD

mvn spring-boot:run
# Runs on http://localhost:8080
# Admin auto-created: admin@wfc.com / Admin@123
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## API ENDPOINTS

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Products (Public)
- GET  /api/products              — all active products
- GET  /api/products?category=X  — filter by category
- GET  /api/products?search=X    — search
- GET  /api/products/{id}        — single product
- GET  /api/products/categories  — all categories

### Orders (Auth required)
- POST /api/orders                — create order + get Razorpay order
- POST /api/orders/verify-payment — verify Razorpay payment
- GET  /api/orders/my             — my orders

### Admin (ADMIN role required)
- GET    /api/admin/products
- POST   /api/admin/products
- PUT    /api/admin/products/{id}
- DELETE /api/admin/products/{id}
- GET    /api/admin/orders
- PUT    /api/admin/orders/{id}/status

---

## DEPLOY ON RAILWAY (Free)

### Backend
1. Go to railway.app → New Project → Deploy from GitHub
2. Add PostgreSQL plugin → Railway auto-sets DATABASE_URL
3. Set environment variables:
   ```
   JWT_SECRET=your-very-long-secret-key-min-32-chars
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_secret
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```

### Frontend
1. Go to vercel.com → Import GitHub repo → select frontend folder
2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
3. Update vite.config.js proxy to point to Railway backend URL

---

## RAZORPAY SETUP
1. Sign up at razorpay.com
2. Dashboard → Settings → API Keys → Generate Key
3. Add Key ID and Key Secret to environment variables
4. For production: implement full Razorpay Java SDK in OrderService.java

## WHATSAPP
- Update phone number in Home.jsx, ProductDetail.jsx, and Cart.jsx
- Replace `919876543210` with your actual number (with country code, no +)

## DEFAULT ADMIN LOGIN
- Email: admin@wfc.com
- Password: Admin@123
- Change this in DataSeeder.java before going live!
