const express = require('express');
const stripe = require('stripe')('your_stripe_secret_key');
const app = express();

app.use(express.json());

app.post('/charge', async (req, res) => {
  try {
    const { token, appointmentId, guestName } = req.body;

    const charge = await stripe.charges.create({
      amount: 2500, // $25.00 in cents
      currency: 'usd',
      description: 'Nail appointment',
      source: token,
      metadata: {
        appointmentId: appointmentId,
        guestName: guestName
      }
    });

    // Here you would also update your database to mark the appointment as paid
    // and associate it with the guest name

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));