const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const client = redis.createClient({
  url: 'redis://redis:6379'
});

client.connect().catch(console.error);

app.use(bodyParser.json());

// app.post('/message', async (req, res) => { Example for posting endpoint
//   const { message } = req.body;
//   if (!message) return res.status(400).json({ error: 'Message is required' });

//   await client.rPush('messages', message);
//   res.json({ status: 'Message added' });
// });

app.get('/message', async (req, res) => { // easier to experiment Example: http://localhost:3000/message?m=Hello%20Redis
    const message = req.query.m;
    if (!message) {
      return res.status(400).json({ error: 'Message is required in query ?m=' });
    }
  
    await client.rPush('messages', message);
    res.json({ status: 'Message added', message });
  });

app.get('/messages', async (req, res) => { // Read messages
  const messages = await client.lRange('messages', 0, -1);
  res.json({ messages });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});