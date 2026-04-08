# Real-Time Chat Application

A comprehensive, full-stack real-time chat application built with a modern microservices architecture. It features real-time messaging, user authentication with OTP verification, image sharing, and a responsive UI.

**🌐 Live Demo:** [https://your-aws-domain-or-ip.com](https://your-aws-domain-or-ip.com)

## 🏗️ Architecture / Project Structure

The project is structured into a functional frontend and a microservices-based backend to ensure scalability and separation of concerns.

* **Frontend (`/frontend`)**: A Next.js 15+ (App Router) application that provides a responsive and interactive user interface.
* **Backend (`/backend`)**: Divided into three distinct microservices interacting with each other:
  * **User Service (`/backend/user`)**: REST API handling user registration, authentication (JWT), profile management, and emitting mail events.
  * **Chat Service (`/backend/chat`)**: WebSocket (Socket.io) and REST API service managing real-time peer-to-peer/group communication, message histories, typing indicators, and media uploads via Cloudinary.
  * **Mail Service (`/backend/mail`)**: A RabbitMQ consumer worker that listens for events from the User service and handles background email tasks (e.g., sending OTPs for verification).

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **State Management:** React Context API (`AppContext`, `SocketContext`)
- **Real-time:** `socket.io-client`

### Backend
- **Core:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Real-time Communication:** Socket.io
- **Message Broker:** RabbitMQ (for inter-service communication)
- **File Uploads:** Cloudinary, Multer
- **Authentication:** JSON Web Tokens (JWT)

## ⚡ Features

- 🔐 **Authentication:** User login and registration with OTP email verification.
- 💬 **Real-time Messaging:** Instant messaging powered by WebSockets.
-  typing **Activity Indicators:** See when the other person is typing in real-time.
- 🟢 **Online Status:** Real-time online/offline user status.
- 🖼️ **Media Sharing:** Send images/files in chats (Cloudinary integration).
- 🧩 **Microservices:** Decoupled architecture using RabbitMQ for background tasks (like email processing).

## 🛠️ Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js (v18 or higher)
- MongoDB (Running locally or MongoDB Atlas URI)
- RabbitMQ server (Running locally or cloud-hosted AMQP)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/Your-Repo-Name.git
   cd Real-time-chat
   ```

2. **Install Dependencies:**
   You will need to install npm packages in the frontend and each backend service.
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend Services
   cd ../backend/chat && npm install
   cd ../user && npm install
   cd ../mail && npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in each respective directory (`frontend`, `backend/chat`, `backend/user`, `backend/mail`) and configure your connection strings for MongoDB, RabbitMQ, JWT Secrets, and Cloudinary credentials.

4. **Running the Applications:**
   Start each service in a separate terminal:
   ```bash
   # Run Frontend
   cd frontend && npm run dev

   # Run User Service
   cd backend/user && npm run dev

   # Run Chat Service
   cd backend/chat && npm run dev

   # Run Mail Service
   cd backend/mail && npm run dev
   ```

## 🔒 Environment Variables Reference (Example)

**Backend services typically require:**
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `RABBITMQ_URL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- SMTP/Email credentials (for the Mail service)

**Frontend typically requires:**
- `NEXT_PUBLIC_SOCKET_URL` (Chat service URL)
- `NEXT_PUBLIC_API_URL` (Base backend URLs)
