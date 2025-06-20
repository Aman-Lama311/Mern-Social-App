MERN Instagram Clone
A full-stack Instagram-like social media application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can create posts, like and comment on them, bookmark posts, and manage their profiles with secure authentication.

Features
User authentication with JWT

Create, update, and delete posts

Like and comment on posts

Bookmark and unbookmark posts

Manage user profiles (edit bio, upload profile picture)

Follow/unfollow users

Image upload using Multer and Cloudinary

Global state management using Redux Toolkit

Fully responsive UI

Tech Stack
Frontend:

React.js

Redux Toolkit

Axios

Tailwind CSS (or your preferred CSS framework)

Backend:

Node.js

Express.js

MongoDB with Mongoose

JWT for authentication

Multer for image handling

Cloudinary for image storage

Getting Started
Prerequisites
Node.js and npm installed

MongoDB setup (local or cloud)

Cloudinary account for image storage

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/mern-insta-clone.git
Navigate to the project directory:

bash
Copy
Edit
cd mern-insta-clone
Install dependencies:

Frontend:

bash
Copy
Edit
cd frontend
npm install
Backend:

bash
Copy
Edit
cd ../backend
npm install
Create .env files in both the frontend and backend folders with the required environment variables.

Backend .env example:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Start the development servers:

Backend:

bash
Copy
Edit
cd backend
npm run dev
Frontend:

bash
Copy
Edit
cd frontend
npm run dev
Folder Structure
php
Copy
Edit
mern-insta-clone/
├── frontend/        # React frontend
├── backend/         # Express backend
└── README.md
License
This project is open source and free to use for learning and development purposes.

