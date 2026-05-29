# Lost & Found Item Tracking System

A full-stack web application for managing lost and found items in a school environment.

## Features

- User registration and authentication (JWT)
- Report lost and found items
- Claim items with admin approval
- Admin panel for managing claims and items
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **Backend:** Express.js (Node.js)
- **Database:** MySQL
- **Authentication:** JWT + bcrypt

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Database Setup

1. Create a MySQL database named `lostfound_db`
2. Run the SQL script in `database/schema.sql` to create tables and insert sample data

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd lostfound/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=lostfound_db
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd lostfound/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

### Usage

1. Open your browser and go to `http://localhost:3000`
2. Register as a new user or login with existing credentials
3. Admin credentials: username: `admin`, password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users (admin only)

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id/status` - Update item status (admin only)
- `DELETE /api/items/:id` - Delete item (admin only)
- `POST /api/items/:id/claim` - Claim an item

### Claims
- `GET /api/claims` - Get all claims (admin only)
- `GET /api/claims/my` - Get user's claims
- `PUT /api/claims/:id` - Approve/reject claim (admin only)

## Project Structure

```
lostfound/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Claim.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── items.js
│   │   └── claims.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ReportItem.js
│   │   │   ├── ItemList.js
│   │   │   ├── Claims.js
│   │   │   └── AdminPanel.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── database/
    └── schema.sql
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- Role-based access control (RBAC)
- SQL injection prevention with parameterized queries

## License

This project is for educational purposes.