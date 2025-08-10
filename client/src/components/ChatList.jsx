import React from "react";

export default function ChatList({ chats, active, onSelect, currentUser }) {
  function handleNewChat() {
    const id = prompt("Enter recipient username / number:");
    if (id && id !== currentUser) {
      onSelect(id);
    } else {
      alert("You can't chat with yourself.");
    }
  }

  return (
    <div className="bg-white border-r border-gray-300 flex flex-col h-screen">
      
      <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-green-500 text-white">
        <span className="font-semibold">{currentUser}</span>
        <button
          onClick={handleNewChat}
          className="bg-white text-green-600 px-3 py-1 rounded-full shadow-md hover:bg-gray-100"
        >
          New
        </button>
      </div>

      
      <div className="flex-1 overflow-auto">
        {chats.map((c) => (
          <div
            key={c.wa_id}
            onClick={() => onSelect(c.wa_id)}
            className={`p-4 cursor-pointer flex items-center gap-3 border-b border-gray-100 transition hover:bg-gray-50 ${
              active === c.wa_id ? "bg-gray-100" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">
              {c.name ? c.name[0].toUpperCase() : c.wa_id[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{c.name || c.wa_id}</div>
              <div className="text-sm text-gray-500 truncate">{c.lastMessage}</div>
            </div>
            <div className="text-xs text-gray-400">
              {c.lastTimestamp && new Date(c.lastTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
