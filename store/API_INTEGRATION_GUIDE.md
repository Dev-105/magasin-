# API Integration Guide

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Success Response Example
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "message": "User retrieved successfully"
}
```

### Error Response Example
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": {
    "email": ["Email not found"]
  }
}
```

## Authentication

### Login Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "city": "New York",
      "address": "123 Main St",
      "profile_image": "https://example.com/image.jpg",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Register Response
Same as login response

## Products

### List Products Response
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "Product Title",
        "description": "Product description",
        "price": 99.99,
        "discount": 10,
        "stock": 50,
        "theme": "blue",
        "images": [
          {
            "id": 1,
            "image_url": "https://example.com/image.jpg"
          }
        ],
        "tags": [
          {
            "id": 1,
            "name": "Electronics"
          }
        ],
        "is_liked": false,
        "reviews_count": 5,
        "likes_count": 10
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

### Product Details Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Product Title",
    "description": "Product description",
    "price": 99.99,
    "discount": 10,
    "stock": 50,
    "theme": "blue",
    "images": [
      {
        "id": 1,
        "image_url": "https://example.com/image.jpg"
      }
    ],
    "tags": [
      {
        "id": 1,
        "name": "Electronics"
      }
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great product!",
        "user": {
          "id": 2,
          "name": "Jane Doe"
        }
      }
    ],
    "is_liked": false,
    "likes_count": 10
  }
}
```

## Cart

### Get Cart Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "title": "Product Title",
        "price": 99.99,
        "discount": 10
      }
    }
  ]
}
```

### Add to Cart
```
POST /cart
Body: {
  "product_id": 1,
  "quantity": 2
}
```

### Update Cart Item
```
PUT /cart/{cartItemId}
Body: {
  "quantity": 3
}
```

### Remove from Cart
```
DELETE /cart/{cartItemId}
```

## Orders

### Create Order
```
POST /orders
Body: {
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "promo_code": "SAVE20"
}
```

### Order Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending",
    "total_price": 189.98,
    "promo_code": {
      "id": 1,
      "code": "SAVE20",
      "discount_percentage": 20
    },
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "price": 99.99,
        "quantity": 2,
        "product": {
          "id": 1,
          "title": "Product Title"
        }
      }
    ],
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "city": "New York",
      "address": "123 Main St"
    },
    "created_at": "2024-04-30T10:00:00"
  }
}
```

## Promo Codes

### Validate Promo Code
```
POST /promo-codes/validate
Body: {
  "code": "SAVE20"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "code": "SAVE20",
    "discount_percentage": 20,
    "expiry_date": "2024-12-31"
  }
}
```

## Admin Endpoints

### Create Product
```
POST /admin/products
Body: {
  "title": "New Product",
  "description": "Product description",
  "price": 99.99,
  "discount": 10,
  "stock": 50,
  "theme": "blue",
  "image_urls": ["https://example.com/image.jpg"],
  "tag_ids": [1, 2, 3]
}
```

### Update Product
```
PUT /admin/products/{productId}
Body: Same as create
```

### Delete Product
```
DELETE /admin/products/{productId}
```

### List All Orders (Admin)
```
GET /admin/orders
```

### Update Order Status
```
PUT /admin/orders/{orderId}
Body: {
  "status": "shipped"
}
```

Valid statuses: pending, paid, shipped, completed, cancelled

### Manage Tags
```
GET /tags
POST /tags { "name": "Tag Name" }
PUT /tags/{tagId} { "name": "New Name" }
DELETE /tags/{tagId}
```

### Manage Promo Codes
```
GET /admin/promo-codes
POST /admin/promo-codes {
  "code": "SAVE20",
  "discount_percentage": 20,
  "expiry_date": "2024-12-31"
}
PUT /admin/promo-codes/{id} { same fields }
DELETE /admin/promo-codes/{id}
```

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Not allowed |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Server Error |

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error message for this field"]
  }
}
```

## Authorization Header

All authenticated requests should include:
```
Authorization: Bearer {token}
```

The Axios interceptor automatically adds this header if a token exists in localStorage.

## Interceptor Behavior

### Request Interceptor
- Automatically adds `Authorization: Bearer {token}` header if token exists
- Adds `Content-Type: application/json` header

### Response Interceptor
- Returns `response.data` (unwraps the response)
- On 401 response: clears token and user from localStorage, redirects to login
- Passes errors to catch block for error handling

## Example Usage

### Login
```javascript
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

if (response.success) {
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
}
```

### Add to Cart
```javascript
const response = await api.post('/cart', {
  product_id: 1,
  quantity: 2
});

if (response.success) {
  console.log('Added to cart');
}
```

### Create Product (Admin)
```javascript
const response = await api.post('/admin/products', {
  title: 'New Product',
  description: 'Description',
  price: 99.99,
  discount: 10,
  stock: 50,
  theme: 'blue',
  image_urls: ['https://example.com/image.jpg'],
  tag_ids: [1, 2]
});
```

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are in decimal format
- Images should be provided as full URLs
- The backend should validate all inputs
- CORS should be enabled on the backend for the frontend URL
