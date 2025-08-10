const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get chat list for a user
router.get('/chats/:user', async (req, res) => {
  const user = req.params.user;
  try {
    const agg = await Message.aggregate([
      { $match: { $or: [{ from: user }, { to: user }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$from", user] }, "$to", "$from"]
          },
          wa_id: { $first: { $cond: [{ $eq: ["$from", user] }, "$to", "$from"] } },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages between two users
router.get('/:user/:other', async (req, res) => {
  const { user, other } = req.params;
  try {
    const msgs = await Message.find({
      $or: [
        { from: user, to: other },
        { from: other, to: user }
      ]
    }).sort({ timestamp: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post('/send', async (req, res) => {
  try {
    const { from, to, text } = req.body;
    const now = new Date();

  
    const msg = new Message({
      from,
      to,
      text,
      timestamp: now,
      status: 'sent'
    });

    await msg.save();

    const io = req.app.get('io');

 
    io.to(from).emit('message:new', msg);
    io.to(to).emit('message:new', msg);

    res.json(msg);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
