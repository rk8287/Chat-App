import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

export default function ChatWindow({ wa_id, socket, refreshChats, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef();

  // Fetch messages between two users
  async function fetchMsgs() {
    try {
      const res = await api.get(`/messages/${currentUser}/${wa_id}`);
      setMessages(res.data);
      refreshChats();
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }

  useEffect(() => {
    fetchMsgs();
    if (socket) socket.emit("joinRoom", currentUser);

    if (socket) {
      socket.on("message:new", (m) => {
        if (
          (m.from === currentUser && m.to === wa_id) ||
          (m.to === currentUser && m.from === wa_id)
        ) {
          setMessages((prev) => [...prev, m]);
        }
      });
    }

    return () => {
      if (socket) socket.off("message:new");
    };
  }, [wa_id, socket, currentUser]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post("/messages/send", {
        from: currentUser,
        to: wa_id,
        text,
      });
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
   
      <div className="p-4 border-b border-gray-300 bg-white shadow-md sticky top-0 z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          {wa_id[0].toUpperCase()}
        </div>
        <div className="font-semibold text-lg">{wa_id}</div>
      </div>


      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((m, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              m.from === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl shadow-md max-w-[75%] backdrop-blur-md ${
                m.from === currentUser
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <div className="text-sm">{m.text}</div>
              <div className="text-[10px] mt-1 opacity-70 text-right">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={endRef} />
      </div>

   
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-300 bg-white flex items-center gap-2 sticky bottom-0"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-5 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full shadow-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
