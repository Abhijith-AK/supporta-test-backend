
# 🧩 Machine Test - Backend API

This project is a Node.js + Express.js backend with MongoDB using Mongoose.  
It covers authentication, user profile management, product and brand management, with blocking system and JWT token-based authentication.

---

## ✅ Tech Stack

- **Express.js**
- **MongoDB + Mongoose**
- **JWT** (Access & Refresh Tokens)
- **bcrypt.js** (for password hashing)
- **Multer** (file upload)
- **Postman Collection included**

---

## ✅ How to Setup

1. Clone the repository:

```
git clone https://github.com/Abhijith-AK/supporta-test-backend.git
cd machine-test-backend
```

2. Install dependencies:

```
npm install
```

3. `.env`  file is already in the repo for testing purposes.
  ⚠️ Note: Do not misuse the keys. Replace them with your own for production.

4. Start the server:

```
npm run dev
```

---

## ✅ API Endpoints

### Auth
- **POST /api/users/register** → Register user
- **POST /api/users/login** → Login user
- **POST /api/users/refresh-token** → Refresh access token
- **PUT /api/users/profile** → Update profile
- **DELETE /api/users/profile** → Delete profile

### User Management
- **POST /api/users/block/:userId** → Block user
- **POST /api/users/unblock/:userId** → Unblock user

### Brand Management
- **POST /api/brands** → Add brand
- **GET /api/brands** → Get all brands

### Product Management
- **POST /api/products** → Add product
- **PUT /api/products/:id** → Edit product
- **DELETE /api/products/:id** → Delete product
- **GET /api/products** → View all products (with filter/sort/block system)
- **GET /api/products/my-products** → View my products

---

## ✅ Sample Request / Response

### 🔑 Register User
**POST** `/api/users/register`

**Body (form-data):**
```
username: testuser
email: test@example.com
password: password123
profilePhoto: (file)
```

**Response:**
```json
{
  "message": "Registered Successfully",
  "newUser": {
    "_id": "123456789",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 🔑 Refresh Token
**POST** `/api/users/refresh-token`

**Response:**
```json
{
  "message": "Access token refreshed successfully"
}
```

---

## ✅ Postman Collection

Postman collection is included:  
👉 [Machine_Test_Postman_Collection.json](./Machine_Test_Postman_Collection.json)

> 💡 Import this in Postman to test all APIs.

---

## ✅ Notes

- Tokens are stored in **HTTP-only cookies** for security.
- Passwords are encrypted using **bcrypt.js**.
- Images are uploaded using **Multer**.
- Blocking system ensures blocked users can't see your products.

---

## ✅ Contact

For any issues, contact:  
[Abhijith Krishna A K] - [abhijithkrishnaofficial@gmail.com]
