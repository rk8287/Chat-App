
# MERN Real-Time Chat App 💬

A responsive, real-time chat application built using **MERN Stack** and **Socket.IO**.  
Supports **multi-user private messaging**, **real-time updates**, and **mobile-friendly UI**.

---

## 🚀 Features
- **User Login** (simple username-based login, no password for demo)
- **Private Chat** between two users
- **Real-time Messaging** using Socket.IO
- **Responsive UI** with Tailwind CSS
- **Persistent Chat History** with MongoDB
- **Online Deployment Ready** (Backend: Render, Frontend: Netlify/Vercel)

---

## 🛠️ Tech Stack
### Frontend:
- React (Vite)
- Tailwind CSS
- Framer Motion (animations)
- Axios (API calls)
- Socket.IO Client

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO Server
- CORS + dotenv

---

## 📂 Project Structure
```

project-root/
│
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # ChatList, ChatWindow, etc.
│   │   ├── services/    # Axios API config
│   │   └── App.jsx
│   └── package.json
│
├── server/              # Backend (Node + Express)
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── index.js         # Entry point
│   └── package.json
│
└── README.md

````

---

## 📥 Installation & Local Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/chat-app.git
cd chat-app
````

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run backend:

```bash
npm run dev
```

> Backend runs on: **[http://localhost:5000](http://localhost:5000)**

---

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file inside `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

> Frontend runs on: **[http://localhost:5173](http://localhost:5173)** (by default)

---

## 🌐 Deployment Instructions

### Backend (Render)

1. Push code to GitHub.
2. Go to [Render](https://render.com) → Create **New Web Service**.
3. Select `server/` as **Root Directory**.
4. Add Environment Variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
5. Deploy → Copy live backend URL (e.g., `https://chat-app-xyz.onrender.com`).

### Frontend (Netlify/Vercel)

1. Go to Netlify or Vercel.
2. Link to your GitHub repo → Select `client/` as **Root Directory**.
3. Add Environment Variable:

   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
4. Deploy → Your app is live.

---

## 📖 How to Use

1. Open app URL.
2. Enter your username and click **Login**.
3. Click **New** to start a new chat.
4. Open the same app in another browser or device with a **different username**.
5. Send messages and see them appear in real-time.

---

## 🔍 Example User Flow

* **User 1** logs in as `alice`
* **User 2** logs in as `bob`
* Alice clicks **New**, enters `bob`
* They both can now chat instantly

---

## ⚠️ Notes

* This is a demo — no authentication system.
* All messages are stored in MongoDB.
* For production, add **JWT Auth** and improve security.

---

## 📸 Screenshots

### 💻 Desktop View

![Desktop Screenshot](screenshot-desktop.png)

### 📱 Mobile View

![Mobile Screenshot](screenshot-mobile.png)

---

## 📜 License

MIT License © 2025 Raunak


