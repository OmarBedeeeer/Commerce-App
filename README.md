# Commerce-App

An advanced and scalable e-commerce platform built with Node.js, Express, MongoDB, and TypeScript. This app includes a wide array of features from product management to cart and order handling, providing a comprehensive online shopping experience.

Features ✨
User Features:
User Authentication: Registration, login, and secure password reset with email verification.
Product Browsing: View categories, subcategories, and products with advanced filtering options.
Search, Sort, and Filter: Search products by name, category, or subcategory. Sort by price, ratings, or newest. Apply filters to narrow down results.
Pagination: Efficient browsing of products with pagination support.
Shopping Cart: Add, update, and remove products from the cart, with total cost dynamically calculated.
Coupon Management: Apply discount coupons to the cart.
Wishlist: Add and manage favorite products.
Order Placement: Review and confirm orders before checkout.

Admin Features:
Category and Subcategory Management: Full CRUD (Create, Read, Update, Delete) operations for categories and subcategories.
Product Management: Add, update, and delete products with price, stock, and description.
Order Management: View and manage customer orders

Technologies Used 🛠️
Backend:
Node.js with Express.js: For building the RESTful API.
MongoDB with Mongoose: For database management and schemas.
TypeScript: For type safety and scalable code.
JWT Authentication: For secure user authentication and authorization.
Bcrypt: For password hashing.
Express Validator: For request validation.

Key Functionalities ⚙️
Authentication & Authorization:

Secure login and registration using JWT.
Email verification and password reset functionality.
Product & Category Management:

Create, read, update, and delete categories, subcategories, and products.
Ability to manage product stock and availability.
Cart & Orders:

Users can add products to their cart and manage multiple instances of the same product.
Cart total is dynamically calculated based on product prices and quantities.
Order placement and order summary.
Coupon System:
Apply coupon codes to cart for discounts.
