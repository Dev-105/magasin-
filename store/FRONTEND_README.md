# E-Commerce Frontend Application

A complete React-based e-commerce frontend application built with Vite, React Router, and Axios.

## Features

### User Features
- 🔐 User Authentication (Register, Login, Logout)
- 📦 Browse Products with Pagination
- 👁️ View Product Details with Theme-based Background
- ⭐ Add/Remove Reviews and Ratings
- ❤️ Like/Unlike Products
- 🛒 Shopping Cart Management
- 📋 Order Creation and Management
- 📊 Order History and Status Tracking
- 👤 User Profile Management

### Admin Features
- 🎛️ Admin Dashboard
- 📝 Product Management (CRUD)
- 🏷️ Tag Management (CRUD)
- 🎁 Promo Code Management (CRUD)
- 📦 Order Management and Status Updates

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailsPage.jsx
│   ├── CartPage.jsx
│   ├── OrdersPage.jsx
│   ├── OrderDetailsPage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminProducts.jsx
│   ├── AdminOrders.jsx
│   ├── AdminTags.jsx
│   └── AdminPromoCodes.jsx
├── components/
│   └── Navbar.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A running Laravel backend API

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file:**
   Create a `.env` file in the root of the `store` folder with:
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

4. **Make sure the Laravel backend is running:**
   The backend should be accessible at `http://127.0.0.1:8000`

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Integration

The application uses Axios with automatic token management:
- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Authentication**: Bearer token automatically attached from localStorage
- **Token Storage**: Saved in localStorage after login
- **Auto Logout**: On 401 responses, user is automatically logged out

## Usage

### User Workflow

1. **Register/Login**: Create an account or log in
2. **Browse Products**: View all products with pagination
3. **Product Details**: Click on a product to see details, images, reviews, and likes
4. **Shopping Cart**: Add products to cart and manage quantities
5. **Checkout**: Apply promo codes and create orders
6. **Order History**: Track orders and view status
7. **Profile**: Update personal information

### Admin Workflow

1. **Login as Admin**: Use an admin account
2. **Admin Dashboard**: Access all management features from `/admin`
3. **Manage Products**: Create, edit, delete products with images and tags
4. **Manage Tags**: Create, edit, delete product tags
5. **Manage Promo Codes**: Create, edit, delete discount codes
6. **Manage Orders**: Update order status (pending → paid → shipped → completed/cancelled)

## Key Features

### Theme-Based Product Details
Each product has a theme that changes the background color of the product details page:
- red, blue, green, yellow, purple, orange, pink, cyan, default

### Pagination
Products page supports pagination with "Next" and "Previous" buttons.

### Promo Codes
- Apply discount codes to orders before checkout
- Admin can create and manage promo codes with expiry dates

### Order Status Tracking
Orders progress through states:
- pending → paid → shipped → completed (or cancelled)

### Review System
- Each user can add one review per product
- Reviews include rating (1-5 stars) and comments
- All reviews are visible on the product details page

## API Endpoints Used

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Products
- `GET /products?page=1&per_page=10&search=query` - List products
- `GET /products/{id}` - Get product details
- `POST /products/{id}/like` - Like/unlike product

### Reviews
- `POST /products/{id}/reviews` - Add review

### Cart
- `GET /cart` - Get cart items
- `POST /cart` - Add to cart
- `PUT /cart/{id}` - Update cart item quantity
- `DELETE /cart/{id}` - Remove from cart

### Orders
- `GET /orders` - User's orders
- `GET /orders/{id}` - Order details
- `POST /orders` - Create order

### Profile
- `PUT /profile` - Update profile

### Admin
- `GET /admin/products` - List all products
- `POST /admin/products` - Create product
- `PUT /admin/products/{id}` - Update product
- `DELETE /admin/products/{id}` - Delete product
- `GET /admin/orders` - List all orders
- `PUT /admin/orders/{id}` - Update order status
- `GET /tags` - List tags
- `POST /tags` - Create tag
- `PUT /tags/{id}` - Update tag
- `DELETE /tags/{id}` - Delete tag
- `GET /admin/promo-codes` - List promo codes
- `POST /admin/promo-codes` - Create promo code
- `PUT /admin/promo-codes/{id}` - Update promo code
- `DELETE /admin/promo-codes/{id}` - Delete promo code

## Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

## Technologies Used

- **React 19** - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - CSS framework
- **JavaScript ES6+** - Language

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The UI is minimal and focused on functionality
- All forms include basic validation
- Loading states are provided for async operations
- Error handling includes user-friendly messages
- Token is automatically managed via interceptors
- Redirects to login on unauthorized (401) responses
