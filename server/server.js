require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://chat-app-mq1j.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});


app.use(cors({
  origin: ['http://localhost:3000', 'https://chat-app-mq1j.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// connect to mongodb
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> console.log('MongoDB connected'))
.catch(err=> { console.error(err); process.exit(1); });

// Models
const Message = require('./models/Message');

// Socket.io
io.on('connection', socket => {
  console.log('socket connected', socket.id);
  socket.on('joinRoom', room => socket.join(room));
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

// Share io via app
app.set('io', io);

// Routes
app.use('/api/messages', require('./routes/message'));

//Api health
app.get('/api/health', (req,res)=> res.json({ok:true, time: new Date()}));

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
