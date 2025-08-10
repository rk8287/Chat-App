const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('../models/Message');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const dir = path.join(__dirname, 'sample_payloads');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    let payload;
    try { payload = JSON.parse(content); } catch (e) { console.warn('skip', f); continue; }

    // Handle typical webhook structures — adapt per payload shape
    // Example assumed: { messages: [...], statuses: [...] }
    if (payload.messages && Array.isArray(payload.messages)) {
      for (const m of payload.messages) {
        const doc = {
          id: m.id || m.message_id || m.msg_id,
          meta_msg_id: m.meta_msg_id || null,
          wa_id: m.from || m.to || m.wa_id || m.sender,
          name: m.push_name || m.profile_name || null,
          number: m.wa_id || null,
          text: (m.text && m.text.body) ? m.text.body : (m.body || m.message),
          timestamp: m.timestamp ? new Date(Number(m.timestamp) * 1000) : new Date(),
          status: 'sent',
          raw: m
        };
        await Message.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
      }
    }
    if (payload.statuses && Array.isArray(payload.statuses)) {
      for (const s of payload.statuses) {
        const ref = s.id || s.message_id || s.meta_msg_id;
        const newStatus = s.status || s.delivery || s.event;
        await Message.updateOne(
          { $or: [{ id: ref }, { meta_msg_id: ref }] },
          { $set: { status: newStatus, raw: s } }
        );
      }
    }
  }
  console.log('Done processing payloads');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
