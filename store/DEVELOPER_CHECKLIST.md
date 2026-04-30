# 📋 Developer Checklist

## Pre-Development

- [ ] Laravel backend created and running
- [ ] Backend migrations completed
- [ ] Backend API routes defined
- [ ] CORS enabled on backend (allow frontend URL)
- [ ] Frontend dependencies installed (`npm install`)

---

## Frontend Setup Verification

- [ ] `.env` file created with `VITE_API_URL=http://127.0.0.1:8000/api`
- [ ] All 14 pages exist in `src/pages/`
- [ ] Navbar component exists in `src/components/`
- [ ] API service with interceptors in `src/services/api.js`
- [ ] App.jsx has complete routing
- [ ] No import errors in browser console

---

## Testing: User Features

### Registration & Login
- [ ] Can register new user
- [ ] Token saved to localStorage after registration
- [ ] User object saved to localStorage
- [ ] Can log in with existing user
- [ ] Logged in user shown in navbar
- [ ] Can log out successfully
- [ ] Redirected to login on unauthorized access

### Products Page
- [ ] Products load from API
- [ ] Pagination works (Next/Previous buttons)
- [ ] Search functionality works
- [ ] Correct product count shown per page
- [ ] Clicking product goes to details page

### Product Details Page
- [ ] Product details load
- [ ] Background color changes based on theme
- [ ] Product images display
- [ ] Tags display correctly
- [ ] Can add review
- [ ] Can like/unlike product
- [ ] Existing reviews display with ratings
- [ ] Can add to cart

### Shopping Cart
- [ ] Products can be added to cart
- [ ] Cart shows all items
- [ ] Quantities can be updated
- [ ] Items can be removed
- [ ] Totals calculate correctly
- [ ] Promo codes can be applied
- [ ] Discount shows on total

### Orders
- [ ] Can create order from cart
- [ ] Order confirmation received
- [ ] Order appears in order history
- [ ] Can view order details
- [ ] Order status displays correctly
- [ ] Shipping information shows

### Profile
- [ ] Can view profile information
- [ ] Can update all fields
- [ ] Changes save successfully
- [ ] Profile image URL displays
- [ ] Updated info reflects in navbar

---

## Testing: Admin Features

### Admin Access
- [ ] Only admin users can access `/admin`
- [ ] Non-admin redirected to home
- [ ] Admin dashboard displays all options

### Manage Products
- [ ] Can create new product
  - [ ] Title, description, price required
  - [ ] Discount and stock fields work
  - [ ] Theme selector works
  - [ ] Multiple image URLs can be added
  - [ ] Tags can be assigned
- [ ] Can edit existing product
- [ ] Can delete product
- [ ] Product list shows all fields
- [ ] Changes persist after refresh

### Manage Tags
- [ ] Can create new tag
- [ ] Can edit tag name
- [ ] Can delete tag
- [ ] Tags appear in product form
- [ ] Tag count shows correctly

### Manage Promo Codes
- [ ] Can create promo code
  - [ ] Code field required
  - [ ] Discount percentage field works
  - [ ] Expiry date picker works
- [ ] Can edit promo code
- [ ] Can delete promo code
- [ ] Expired codes show as "Expired"
- [ ] Active codes show as "Active"
- [ ] Promo code validation works on checkout

### Manage Orders
- [ ] All orders display
- [ ] Can filter by status
- [ ] Can change order status
  - [ ] pending → paid
  - [ ] paid → shipped
  - [ ] shipped → completed
  - [ ] Any status → cancelled
- [ ] Status updates save to database
- [ ] Order details show customer info

---

## API Integration Testing

### Authentication Endpoints
- [ ] POST `/auth/register` works
- [ ] POST `/auth/login` works
- [ ] Returns token and user object
- [ ] Token attached to subsequent requests

### Product Endpoints
- [ ] GET `/products?page=1&per_page=10` returns paginated list
- [ ] GET `/products/:id` returns product details
- [ ] GET `/products` supports search parameter
- [ ] POST `/products/:id/like` toggles like status

### Review Endpoints
- [ ] POST `/products/:id/reviews` creates review
- [ ] Reviews return with user info
- [ ] Rating properly stored

### Cart Endpoints
- [ ] POST `/cart` adds items
- [ ] GET `/cart` returns cart items
- [ ] PUT `/cart/:id` updates quantity
- [ ] DELETE `/cart/:id` removes item

### Order Endpoints
- [ ] POST `/orders` creates order
- [ ] GET `/orders` returns user's orders
- [ ] GET `/orders/:id` returns order details
- [ ] Order items include product info

### Profile Endpoints
- [ ] PUT `/profile` updates user info
- [ ] All fields save correctly
- [ ] Profile image URL saves

### Admin Endpoints
- [ ] GET `/admin/products` returns all products
- [ ] POST `/admin/products` creates product
- [ ] PUT `/admin/products/:id` updates product
- [ ] DELETE `/admin/products/:id` deletes product
- [ ] GET `/admin/orders` returns all orders
- [ ] PUT `/admin/orders/:id` updates status
- [ ] Tag CRUD endpoints work
- [ ] Promo code CRUD endpoints work

### Promo Code Endpoints
- [ ] POST `/promo-codes/validate` validates code
- [ ] Returns discount percentage
- [ ] Checks expiry date

---

## Error Handling

- [ ] 401 responses trigger logout
- [ ] User redirected to login on 401
- [ ] Error messages display to user
- [ ] Network errors show friendly message
- [ ] Form validation errors show
- [ ] API errors show in console

---

## Browser Console

- [ ] No console errors on load
- [ ] No "undefined" imports
- [ ] No 404 errors for assets
- [ ] Network requests show successful responses
- [ ] Token visible in localStorage after login

---

## Performance

- [ ] Pages load within 2 seconds
- [ ] Pagination doesn't freeze UI
- [ ] Search doesn't lag
- [ ] File uploads don't block UI
- [ ] No memory leaks in DevTools

---

## Security

- [ ] Token stored securely in localStorage
- [ ] Token sent with Authorization header
- [ ] No sensitive data in console
- [ ] CORS properly configured
- [ ] No CSRF vulnerabilities

---

## Responsive Design

- [ ] Layout works on mobile (320px+)
- [ ] Layout works on tablet (768px+)
- [ ] Layout works on desktop (1024px+)
- [ ] Forms are usable on all screen sizes
- [ ] Tables scroll on small screens

---

## Cross-Browser Testing

- [ ] Chrome - ✓
- [ ] Firefox - ✓
- [ ] Safari - ✓
- [ ] Edge - ✓

---

## Documentation

- [ ] FRONTEND_README.md is complete
- [ ] API_INTEGRATION_GUIDE.md has all endpoints
- [ ] IMPLEMENTATION_SUMMARY.md lists all features
- [ ] QUICK_START.md is clear and concise
- [ ] Code comments explain complex logic

---

## Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Backend URL matches production
- [ ] Build completes without errors: `npm run build`
- [ ] Production bundle is optimized
- [ ] Frontend deployed to production server
- [ ] Backend API accessible from production server

---

## Post-Launch

- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Monitor API response times
- [ ] Check database for data integrity
- [ ] Plan future features based on usage

---

## Known Limitations (To Address Later)

- [ ] No image upload (uses URLs only)
- [ ] No real payment processing
- [ ] No email notifications
- [ ] No real-time updates
- [ ] No advanced filtering
- [ ] No analytics dashboard
- [ ] No inventory warnings
- [ ] No shipping integration

---

## Notes for Backend Team

Backend must implement these response formats:

### Success Response
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Success"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors */ }
}
```

### Pagination
```json
{
  "success": true,
  "data": {
    "data": [ /* items */ ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

---

## Final Sign-Off

- [ ] All tests passing
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Team trained on codebase
- [ ] Ready for production
- [ ] Approved by QA
- [ ] Approved by stakeholders

---

**Date Completed:** _______________
**Completed By:** _______________
**Reviewed By:** _______________
