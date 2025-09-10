# MERN Stack Web Platform

A web platform built with MongoDB Atlas, Express.js, React.js, and Node.js for handling form inputs and data storage.

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
└── README.md            # Project documentation
```

## Setup Instructions

1. Install dependencies:

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

2. Create a `.env` file in the server directory with your MongoDB Atlas connection string:

   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   ```

3. Start the development servers:

   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## Technologies Used

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB Atlas
- Additional tools: Mongoose, Axios, React Router
