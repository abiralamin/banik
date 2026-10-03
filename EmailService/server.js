require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER;

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Called by the Spring Boot backend for registration / password-reset OTPs.
app.post("/send-otp", async (req, res) => {
  const { to, code, purpose } = req.body || {};
  if (!to || !code) {
    return res.status(400).json({ error: "to and code are required" });
  }

  const purposeLabel =
    purpose === "RESET_PASSWORD"
      ? "reset your password"
      : "verify your Banik account";
  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject: "Banik - Your One-Time Verification Code",
      html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
                    <h2 style="color:#1d4ed8">Banik</h2>
                    <p>Use the code below to ${purposeLabel}. This code expires in 10 minutes.</p>
                    <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#111">${code}</p>
                    <p style="color:#666;font-size:13px">If you did not request this, you can safely ignore this email.</p>
                </div>
            `,
    });
    res.json({ sent: true });
  } catch (err) {
    console.error("Failed to send OTP email:", err.message);
    res.status(502).json({ error: "Failed to send email" });
  }
});

// Called by the backend for general notifications (license approved, complaint updates, etc.)
app.post("/send-notification", async (req, res) => {
  const { to, subject, message } = req.body || {};
  if (!to || !subject) {
    return res.status(400).json({ error: "to and subject are required" });
  }

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to,
      subject: `Banik - ${subject}`,
      html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
                    <h2 style="color:#1d4ed8">Banik</h2>
                    <p>${message || ""}</p>
                </div>
            `,
    });
    res.json({ sent: true });
  } catch (err) {
    console.error("Failed to send notification email:", err.message);
    res.status(502).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`Banik email service listening on http://${HOST}:${PORT}`),
);
