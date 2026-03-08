const path = require("path");
const express = require("express");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy headers (for HTTPS enforcement behind reverse proxy)
app.enable("trust proxy");

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // keep simple for inline scripts/styles
  })
);

// Enforce HTTPS when behind a proxy
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] === "http") {
    const host = req.headers.host;
    return res.redirect(301, `https://${host}${req.url}`);
  }
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (optional, mostly for local dev)
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use((req, res, next) => {
  if (allowedOrigin) {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Static files
const publicDir = path.join(__dirname);
app.use(express.static(publicDir));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Simple healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Booking form endpoint
app.post("/api/booking", async (req, res) => {
  const {
    name,
    phone,
    email,
    address,
    serviceType,
    preferredDate,
    message,
  } = req.body;

  if (!name || !phone || !serviceType) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const to = process.env.BOOKING_RECIPIENT_EMAIL || process.env.SMTP_USER;
  const subject = `New Booking Request from ${name}`;

  const text = `
New booking request for Sonsek Cleaning & Fumigation Services

Name: ${name}
Phone: ${phone}
Email: ${email || "N/A"}
Address: ${address || "N/A"}
Service Type: ${serviceType}
Preferred Date: ${preferredDate || "N/A"}

Message:
${message || "N/A"}
`;

  try {
    await transporter.sendMail({
      from: `"Sonsek Website" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error sending booking email:", error);
    return res.status(500).json({ error: "Failed to send booking request." });
  }
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const to = process.env.CONTACT_RECIPIENT_EMAIL || process.env.SMTP_USER;
  const subject = `New Contact Message from ${name}`;

  const text = `
New contact message from Sonsek Cleaning & Fumigation Services website

Name: ${name}
Phone: ${phone || "N/A"}
Email: ${email || "N/A"}

Message:
${message}
`;

  try {
    await transporter.sendMail({
      from: `"Sonsek Website" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({ error: "Failed to send contact message." });
  }
});

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Sonsek Cleaning website running on port ${PORT}`);
});

