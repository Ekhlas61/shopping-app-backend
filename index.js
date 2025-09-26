import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("💻 Amazon API Backend is running!");
});

// Payment creation route
app.post("/payment/create", async (req, res) => {
  try {
    const total = Math.round(Number(req.query.total));
    console.log("💰 Payment request received for:", total);

    if (!total || isNaN(total)) {
      return res.status(400).send({ error: "Invalid total amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("❌ Stripe error:", err.message);
    res.status(500).send({ error: err.message });
  }
});

// Use PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
