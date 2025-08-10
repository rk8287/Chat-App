import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import api from "./services/api";
import { io } from "socket.io-client";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("chatUser") || "");
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const socket = React.useRef();

  useEffect(() => {
    if (!currentUser) return;

    socket.current = io(API.replace("/api", ""), { transports: ["websocket"] });
    socket.current.on("connect", () => {
      console.log("Socket connected as", currentUser);
      socket.current.emit("joinRoom", currentUser);
    });
    socket.current.on("message:new", () => fetchChats());

    return () => socket.current?.disconnect();
  }, [currentUser]);

  async function fetchChats() {
    if (!currentUser) return;
    const res = await api.get(`/messages/chats/${currentUser}`);
    setChats(res.data);
    if (!active && res.data.length) setActive(res.data[0].wa_id);
  }

  useEffect(() => { fetchChats(); }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentUser.trim()) {
              localStorage.setItem("chatUser", currentUser);
              setCurrentUser(currentUser);
            }
          }}
          className="p-6 bg-white rounded-xl shadow-lg w-80"
        >
          <h2 className="text-lg font-semibold mb-4 text-center">Login to Chat</h2>
          <input
            className="border p-2 mb-4 w-full rounded-md"
            placeholder="Enter your username/number"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          />
          <button className="bg-green-500 w-full py-2 text-white rounded-md hover:bg-green-600">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
     
      <div className={`${active ? "hidden md:block" : "block"} w-full md:w-1/3 lg:w-1/4 border-r h-screen`}>
        <ChatList chats={chats} active={active} onSelect={setActive} currentUser={currentUser} />
      </div>

     
      <div className={`${active ? "block" : "hidden"} md:block w-full md:w-2/3 lg:w-3/4`}>
        {active ? (
          <ChatWindow
            wa_id={active}
            socket={socket.current}
            refreshChats={fetchChats}
            currentUser={currentUser}
            onBack={() => setActive(null)} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
