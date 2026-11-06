# Project Management API

A backend REST API built using Node.js, Express.js, MySQL, Sequelize, MongoDB and Mongoose. It provides user authentication, project management, task management, dashboard statistics, and request logging.

## Features

- User registration and login using JWT authentication
- Password hashing using bcrypt
- Protected routes using authentication middleware
- User profile retrieval and updates
- Project CRUD operations using MySQL and Sequelize
- Task CRUD operations using MongoDB and Mongoose
- Task filtering by project, status, and priority
- Pagination for task listing
- Dashboard statistics combining MySQL and MongoDB data
- Centralized error handling
- Custom request logging using Node.js File System (`fs`)
- Login rate limiting to prevent excessive login attempts
- HTTP security headers using Helmet
- CORS configuration for frontend communication

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- MongoDB
- Mongoose
- JWT
- bcrypt
- Helmet
- CORS
- express-rate-limit
- Node.js File System (`fs`)

## Project Structure

```text
project-management-api/
│
├── config/
│   ├── mysql.js
│   └── mongodb.js
│
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── taskController.js
│   └── dashboardController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── logger.js
│   └── rateLimiter.js
│
├── models/
│   ├── mysql/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── associations.js
│   │
│   └── mongodb/
│       └── Task.js
│
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   └── dashboardRoutes.js
│
├── console.log
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

2. Navigate to the project directory:

```bash
cd project-management-api
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file using `.env.example` as a template.

5. Configure your MySQL and MongoDB connections.

6. Start the development server:

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`

## Database Setup

### MySQL

1. Install and start MySQL.
2. Open phpMyAdmin or MySQL CLI.
3. Create a database:

```sql
CREATE DATABASE project_management;
```

4. Configure MySQL credentials in your `.env` file.

Sequelize synchronizes the defined MySQL models when the application starts.

### MongoDB

1. Install MongoDB locally or create a MongoDB Atlas database.
2. Configure the MongoDB connection string in `.env`.

Example local connection:

```text
mongodb://127.0.0.1:27017/project_management
```

Mongoose connects to MongoDB when the application starts.

## Environment Variables

Create a `.env` file in the project root.

Refer to `.env.example` for the required variables:

- PORT
- MYSQL_HOST
- MYSQL_PORT
- MYSQL_DATABASE
- MYSQL_USER
- MYSQL_PASSWORD
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN

Never commit your actual `.env` file.

## Middleware

### 1. Authentication Middleware

`authMiddleware.js`

- Verifies JWT tokens.
- Protects private API routes.
- Identifies the authenticated user.
- Prevents unauthorized access.

### 2. Request Logger Middleware

`logger.js`

Uses Node.js File System (`fs`) to append incoming request information to a file named `console.log`.

Logged information includes:

- Request body
- HTTP method
- Request path
- Query parameters
- Route parameters

The log file is generated when requests are processed.

### 3. Login Rate Limiter

`rateLimiter.js`

Uses `express-rate-limit` to protect the login endpoint.

Configuration:

- Time window: 15 minutes
- Maximum requests: 10 per IP within the window
- Further attempts receive a rate-limit error message.

The rate limiter is applied specifically to the login route.

## API Documentation

Base URL:

`http://localhost:5000`

All protected endpoints require:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### 1. Authentication APIs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get logged-in user | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

Registration example:

```json
{
  "name": "Saurabh",
  "email": "saurabh@example.com",
  "password": "12345678"
}
```

Login example:

```json
{
  "email": "saurabh@example.com",
  "password": "12345678"
}
```

### 2. Project APIs (MySQL)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | Get all user's projects |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

Create project example:

```json
{
  "name": "Project Management API",
  "description": "Backend API using Node.js and databases"
}
```

Allowed project statuses:

- active
- completed
- archived

### 3. Task APIs (MongoDB)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get all user's tasks |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

Create task example:

```json
{
  "title": "Create authentication API",
  "description": "Implement JWT authentication",
  "projectId": 1,
  "status": "todo",
  "priority": "high"
}
```

Allowed task statuses:

- todo
- in_progress
- completed

Allowed priorities:

- low
- medium
- high

Task filtering and pagination:

```text
GET /api/tasks?status=todo
GET /api/tasks?priority=high
GET /api/tasks?projectId=1
GET /api/tasks?status=todo&priority=high&projectId=1
GET /api/tasks?page=1&limit=10
```

Multiple filters can be combined in a single request.

### 4. Dashboard API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get project and task statistics |

Returns project counts and task counts grouped by status and priority.

## Security

- Passwords are hashed using bcrypt.
- JWT authentication protects private endpoints.
- Login rate limiting prevents excessive login attempts.
- Helmet adds HTTP security headers.
- CORS controls cross-origin frontend access.
- Users can access only their own projects and tasks.
- Environment credentials are stored outside source code.

## License

This project was developed as a backend API assessment.

Note: The services/ folder is currently unused; business logic is handled directly in the controllers.
