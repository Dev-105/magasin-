# 🚀 Quick Start Guide

## Start the Frontend Application

### Step 1: Open Terminal
Navigate to the store folder:
```bash
cd c:\xampp\htdocs\magasin\store
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Navigate to: **http://localhost:5173**

---

## Make Sure Backend is Running

Before testing, ensure the Laravel backend is running:

```bash
cd c:\xampp\htdocs\magasin\api
php artisan serve
```

The backend should be accessible at: **http://127.0.0.1:8000**

---

## Test the Application

### 1. Register a New User
- Go to `/register`
- Fill in all fields (name, email, password, etc.)
- Click "Register"
- You'll be logged in automatically

### 2. Browse Products
- Click "Products" in navbar or go to `/products`
- View product list with pagination
- Try searching for products
- Click on any product to see details

### 3. Test Product Details Page
- Click on a product
- Notice the background color changes based on product theme
- View images, tags, reviews
- Like/unlike the product
- Add a review with rating

### 4. Test Shopping Cart
- Add product to cart
- Go to `/cart`
- Update quantities
- Try removing items
- Apply a promo code (if available)
- Click "Proceed to Checkout"

### 5. Create an Order
- Cart should process and create an order
- Check `/orders` page to see order history
- Click order to see details

### 6. View Profile
- Go to `/profile`
- Update your information
- Save changes

### 7. Admin Features (if you're admin)
- Click "Admin" in navbar (only visible to admins)
- Go to `/admin`

#### Admin - Manage Products
- Click "Manage Products"
- Create a new product:
  - Fill in title, description, price, discount, stock, theme
  - Add image URLs (one per line)
  - Select tags
  - Click "Create Product"
- Edit or delete existing products

#### Admin - Manage Tags
- Click "Manage Tags"
- Create, edit, or delete tags

#### Admin - Manage Promo Codes
- Click "Manage Promo Codes"
- Create promo code with:
  - Code (e.g., "SAVE20")
  - Discount percentage
  - Expiry date
- Edit or delete promo codes

#### Admin - Manage Orders
- Click "View Orders"
- See all user orders
- Change order status using dropdown
- Filter by status

---

## API Response Handling

The frontend expects responses in this format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

If the backend returns a different format, you may see errors in the browser console.

---

## Troubleshooting

### "Cannot connect to API"
- Make sure Laravel backend is running: `php artisan serve`
- Check that `VITE_API_URL` in `.env` matches backend URL
- Check browser console for network errors

### "Login failed"
- Make sure user credentials are correct
- Check backend for user in database
- Look for error message in browser console

### "Missing page components"
- Verify all files exist in `src/pages/`
- Check for import errors in browser console
- Try `npm run build` to check for syntax errors

### "Theme background not changing"
- Theme should be one of: red, blue, green, yellow, purple, orange, pink, cyan, default
- Check product data returned from API

### "Promo code not working"
- Make sure promo code is not expired
- Check backend validates promo code correctly
- Verify discount percentage is set

---

## Key Files Modified/Created

✅ **src/App.jsx** - Complete routing setup
✅ **src/services/api.js** - Axios instance with interceptors
✅ **src/components/Navbar.jsx** - Navigation bar
✅ **src/pages/** - All 14 page components
✅ **.env** - API URL configuration
✅ **src/index.css** - Basic styling

---

## Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run lint
```

---

## Project Structure Summary

```
store/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminTags.jsx
│   │   └── AdminPromoCodes.jsx
│   ├── components/
│   │   └── Navbar.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── FRONTEND_README.md
├── API_INTEGRATION_GUIDE.md
└── IMPLEMENTATION_SUMMARY.md
```

---

## What's Next?

1. ✅ **Frontend is ready to use**
2. Test with your Laravel backend
3. Ensure all API endpoints match the expected format
4. Handle any API response format differences
5. Add more styling if needed
6. Deploy to production

---

## Need Help?

1. **Check browser console** for error messages
2. **Check Network tab** in DevTools to see API calls
3. **Check backend logs** for server-side errors
4. **Review API_INTEGRATION_GUIDE.md** for API documentation
5. **Review FRONTEND_README.md** for feature documentation

---

## Happy Coding! 🎉

The frontend is fully functional and ready for integration with your Laravel backend.
