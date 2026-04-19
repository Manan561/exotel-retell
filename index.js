const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/exotel-webhook', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.retellai.com/v2/register-phone-call',
      {
        agent_id: 'agent_e7e0ba7ee7072c7bf1d4ad3258',
        from_number: req.body.CallFrom || '+919513886363',
        to_number: req.body.CallTo || '+919513886363',
        direction: 'inbound',
      },
      {
        headers: {
          Authorization: `Bearer key_022d5925a053a89f736dad43c70d`,
          'Content-Type': 'application/json',
        },
      }
    );

    const callId = response.data.call_id;
    console.log('Call registered:', callId);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Sip>sip:${callId}@5t4n6j0wnrl.sip.livekit.cloud</Sip>
  </Dial>
</Response>`;

    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    res.status(500).send('Error');
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Webhook running'));
