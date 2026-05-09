@echo off

:: Create folders inside existing src
mkdir src\api
mkdir src\contexts
mkdir src\layouts
mkdir src\pages
mkdir src\pages\admin
mkdir src\components

:: Create api files
type nul > src\api\axios.js
type nul > src\api\auth.js
type nul > src\api\products.js
type nul > src\api\cart.js
type nul > src\api\orders.js
type nul > src\api\admin.js

:: Create context files
type nul > src\contexts\AuthContext.jsx

:: Create layout files
type nul > src\layouts\PublicLayout.jsx
type nul > src\layouts\UserLayout.jsx
type nul > src\layouts\AdminLayout.jsx

:: Create page files
type nul > src\pages\Login.jsx
type nul > src\pages\Register.jsx
type nul > src\pages\Products.jsx
type nul > src\pages\ProductDetail.jsx
type nul > src\pages\Cart.jsx
type nul > src\pages\Profile.jsx
type nul > src\pages\Orders.jsx

:: Create admin page files
type nul > src\pages\admin\Dashboard.jsx
type nul > src\pages\admin\UsersList.jsx
type nul > src\pages\admin\OrdersList.jsx
type nul > src\pages\admin\PromoCodes.jsx

:: Create component files
type nul > src\components\Navbar.jsx
type nul > src\components\ProductCard.jsx
type nul > src\components\ProtectedRoute.jsx

echo Structure created successfully!
pause

