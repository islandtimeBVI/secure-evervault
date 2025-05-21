const express = require('express');
const Evervault = require('@evervault/sdk');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const evervault = new Evervault(process.env.EVERVAULT_API_KEY);

const limiter = rateLimit({ windowMs: 60000, max: 5 });
app.use(express.json());
app.use('/submit-secure-cc/:token', limiter);

app.post('/submit-secure-cc/:token', async (req, res) => {
  const { token } = req.params;
  if (token !== process.env.ACCESS_TOKEN) return res.status(403).json({ error: 'Forbidden' });

  try {
    const encrypted = await evervault.encrypt(req.body);
    console.log('Encrypted Payload:', encrypted);
    res.status(200).json({ success: true, data: encrypted });
  } catch (error) {
    console.error('Encryption Error:', error);
    res.status(500).json({ success: false, message: 'Encryption failed' });
  }
});

app.listen(port, () => console.log(`App running on port ${port}`));
