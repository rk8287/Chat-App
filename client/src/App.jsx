import React, { useState, useEffect, useRef } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import api from './services/api';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('chatUser') || '');
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);
  const socket = useRef();

  // Connect socket when logged in
  useEffect(() => {
    if (!currentUser) return;

    socket.current = io(API.replace('/api', ''), { transports: ['websocket'] });

    socket.current.on('connect', () => {
      console.log('Socket connected as', currentUser);
     
      socket.current.emit('joinRoom', currentUser);
    });

    socket.current.on('message:new', msg => {
      // Only update chat list if the message involves this user
      if (msg.from === currentUser || msg.to === currentUser) {
        fetchChats();
      }
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [currentUser]);

  // Fetch chat list for current user
  async function fetchChats() {
    if (!currentUser) return;
    try {
      const res = await api.get(`/messages/chats/${currentUser}`);
      setChats(res.data);
      if (!active && res.data.length) {
        setActive(res.data[0].wa_id);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    }
  }

  useEffect(() => {
    fetchChats();
  }, [currentUser]);

  // Login screen
  if (!currentUser) {
    const [tempName, setTempName] = useState('');
    return (
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (tempName.trim()) {
              localStorage.setItem('chatUser', tempName.trim());
              setCurrentUser(tempName.trim());
            }
          }}
          className="p-4 border rounded flex flex-col gap-2"
        >
          <h2 className="text-lg font-semibold">Login to Chat</h2>
          <input
            className="border p-2 rounded"
            placeholder="Enter your username/number"
            value={tempName}
            onChange={e => setTempName(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  // Main chat layout
  return (
    <div className="min-h-screen flex">
      
      <div className="w-full md:w-1/3 lg:w-1/4 border-r h-screen overflow-auto">
        <ChatList
          chats={chats}
          active={active}
          onSelect={setActive}
          currentUser={currentUser}
        />
      </div>

     
      <div className="hidden md:flex w-2/3 lg:w-3/4 h-screen">
        {active ? (
          <ChatWindow
            wa_id={active}
            socket={socket.current}
            refreshChats={fetchChats}
            currentUser={currentUser}
          />
        ) : (
          <div className="m-auto">Select a chat to start messaging</div>
        )}
      </div>

      
      <div className="md:hidden w-full">
        {active ? (
          <ChatWindow
            wa_id={active}
            socket={socket.current}
            refreshChats={fetchChats}
            currentUser={currentUser}
          />
        ) : (
          <ChatList
            chats={chats}
            active={active}
            onSelect={setActive}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

export default App;
