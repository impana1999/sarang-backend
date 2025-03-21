# Sarang Dating App - Backend

Sarang is a modern dating app that helps users find their perfect match based on food habits, cultural preferences, zodiac signs, age, and more. Users can like, comment, and interact with each other, while ensuring security with features like blocking, reporting, JWT authentication, and real-time messaging with WebSockets.

## Features
- **User Registration & Authentication**: Sign up/login using email & password with JWT authentication.
- **Profile Matching**: Match based on food habits, culture, signs, age, and preferences.
- **Subscription Plans**: Different tiers for premium features.
- **Security & Privacy**: Block and report users.
- **Real-time Chat**: WebSockets for instant messaging.
- **Admin Panel**: Manage users, reports, and subscriptions.
- - **push Notification**: example added .

---
## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **Security**: Bcrypt.js, Helmet, CORS
---
## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/sarang-dating-app-backend.git
cd sarang-dating-app-backend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. MongoDB Setup
- Ensure MongoDB is running locally or use **MongoDB Atlas**.
- Create a `.env` file and add your MongoDB URI:
```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/sarang
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Start the Server
```sh
node app.js  # For development
```

