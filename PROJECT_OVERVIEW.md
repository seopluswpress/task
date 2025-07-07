# Task Manager Project Overview

## 1. Introduction

The Task Manager is a fullstack web application designed to streamline team task management, enabling efficient assignment, tracking, and collaboration. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), it provides a modern, scalable solution for both administrators and team members.

---

## 2. Technology Stack

### Frontend
- **Platform:** React (with Vite for fast development)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS, Headless UI
- **UI Libraries:** React Icons, Headless UI
- **Form Handling:** react-hook-form
- **Notifications:** sonner
- **HTTP Requests:** axios

### Backend
- **Platform:** Node.js with Express.js
- **Authentication:** JWT (jsonwebtoken), bcryptjs for password hashing
- **Email:** nodemailer
- **Environment Variables:** dotenv
- **Logging:** morgan

### Database
- **Database:** MongoDB (using mongoose ODM)

---

## 3. NPM Packages Used

### Client (Frontend)
- `react`, `react-dom`: Core React libraries
- `vite`: Fast development server and build tool
- `@reduxjs/toolkit`, `react-redux`: State management
- `axios`: HTTP requests
- `moment`: Date/time formatting
- `react-hook-form`: Form handling
- `@headlessui/react`: Accessible UI primitives
- `tailwindcss`, `postcss`, `autoprefixer`: Styling
- `react-icons`: Icon library
- `sonner`: Toast notifications
- `recharts`: Charting library

### Server (Backend)
- `express`: Web server framework
- `mongoose`: MongoDB object modeling
- `mongodb`: MongoDB driver
- `dotenv`: Environment variable management
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `morgan`: HTTP request logger
- `cors`: Cross-Origin Resource Sharing
- `cookie-parser`: Cookie handling
- `nodemailer`: Sending emails
- `express-async-handler`: Async error handling
- `nodemon` (dev): Auto-restart server on code changes

---

## 4. Project Structure & Workflow

### User Roles
- **Admin:** Can manage users, assign tasks, update statuses, manage assets, and control user accounts.
- **User:** Can view, update, and interact with their assigned tasks.

### Key Features

#### Admin Features
- User management (create, activate, disable, delete)
- Task assignment (individual/multiple users)
- Task status and priority management
- Asset (image/file) uploads
- Sub-task management

#### User Features
- Change task status (in progress, completed)
- View task details and history
- Comment/chat on tasks

#### General Features
- Secure authentication (JWT)
- Role-based access control
- Profile and password management
- Activity dashboard
- Real-time notifications (toast popups)

### Typical Workflow
1. **Admin** creates and manages projects, adds users, and assigns tasks.
2. **Users** receive notifications when tasks are assigned or updated.
3. Users can update task status, add comments, and upload files.
4. All activities are logged and visible in the task's activity timeline.
5. Notifications are sent to relevant users for important events (assignments, comments, etc.).

---

## 5. Setup & Deployment

### Server
- Configure environment variables in `.env` (MongoDB URI, JWT secret, etc.)
- Start with `npm install` and `npm run start` (uses nodemon)

### Client
- Configure API base URL if needed
- Start with `npm install` and `npm run dev`

### Database
- Hosted on MongoDB Atlas or local MongoDB instance

---

## 6. Summary

This Task Manager leverages modern web technologies for a robust, scalable, and user-friendly experience. The use of the MERN stack ensures seamless integration between frontend and backend, while npm packages like Redux Toolkit, Tailwind CSS, and sonner provide a smooth and interactive UI.
