const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow development origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://localhost:8081',
      'http://127.0.0.1:8081',
      'https://franci-salv.github.io',
      'https://francescosalvatore.com',
      'https://www.francescosalvatore.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow any origin in development mode
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

const ALLOWED_ORIGINS = [
  'https://francescosalvatore.com',
  'https://www.francescosalvatore.com',
  'https://franci-salv.github.io'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate limiting - 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact form submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Topic mapping for better email organization
const topicLabels = {
  'services': '💼 My Services (Work Opportunity)',
  'hangout': '🎯 Want to Hang Out / Collaborate',
  'question': '❓ Question or Feedback',
  'opportunity': '🚀 Interesting Opportunity',
  'other': '📮 Other'
};

// Validation middleware
const validateContactForm = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
  body('topic')
    .isIn(Object.keys(topicLabels))
    .withMessage('Invalid topic selected'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters')
];

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date() });
});

// Contact form submission route
app.post('/api/contact', contactLimiter, validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { email, topic, message } = req.body;
    const topicLabel = topicLabels[topic] || topic;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission - ${topicLabel}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; margin-bottom: 20px;">New Message from Your Website</h2>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>From:</strong> ${escapeHtml(email)}</p>
            <p><strong>Topic:</strong> ${escapeHtml(topicLabel)}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; white-space: pre-wrap;">
            <strong>Message:</strong><br><br>
            ${escapeHtml(message)}
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This message was sent from your contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user (optional)
    await sendConfirmationEmail(email, topicLabel);

    // Log submission
    console.log(`[${new Date().toISOString()}] Contact form submission received from ${email} - Topic: ${topic}`);

    res.status(200).json({
      message: 'Message sent successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error processing contact form:', error);

    // Don't expose sensitive error details to client
    const statusCode = error.code === 'EAUTH' ? 500 : 500;
    res.status(statusCode).json({
      message: 'Failed to send message. Please try again later or contact directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Optional: Send confirmation email to user
async function sendConfirmationEmail(userEmail, topic) {
  try {
    const confirmMailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'We received your message - Francesco Salvatore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Thank you for reaching out!</h2>
          <p>Hi,</p>
          <p>I've received your message regarding <strong>${escapeHtml(topic)}</strong>. I'll get back to you as soon as possible.</p>
          
          <p style="margin-top: 30px; color: #6b7280;">
            Best regards,<br>
            <strong>Francesco Salvatore</strong>
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(confirmMailOptions);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't fail the main request if confirmation email fails
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// --- Poll System ---
const POLL_FILE = path.join(__dirname, 'poll-data.json');

function loadPollData() {
  try {
    if (fs.existsSync(POLL_FILE)) {
      return JSON.parse(fs.readFileSync(POLL_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading poll data:', e);
  }
  return { votes: 0, voters: [] };
}

function savePollData(data) {
  try {
    fs.writeFileSync(POLL_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving poll data:', e);
  }
}

const pollLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const pollCors = cors({
  origin: [
    'https://francescosalvatore.com',
    'https://www.francescosalvatore.com',
    'https://franci-salv.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
});

app.get('/api/poll/results', pollCors, (req, res) => {
  const data = loadPollData();
  res.json({ votes: data.votes });
});

app.post('/api/poll/vote', pollCors, pollLimiter, (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  const fingerprint = req.body.fingerprint || '';
  const voterKey = `${clientIp}_${fingerprint}`;

  const data = loadPollData();

  if (data.voters.includes(clientIp) || (fingerprint && data.voters.includes(voterKey))) {
    return res.status(409).json({ message: 'You have already voted', votes: data.votes });
  }

  data.votes++;
  data.voters.push(clientIp);
  if (fingerprint) data.voters.push(voterKey);
  savePollData(data);

  console.log(`[${new Date().toISOString()}] Poll vote from ${clientIp} — Total: ${data.votes}`);
  res.json({ message: 'Vote recorded!', votes: data.votes });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Contact Form Server running on http://0.0.0.0:${PORT}`);
  console.log(`📧 Emails will be sent to: ${process.env.RECIPIENT_EMAIL}`);
  console.log(`✅ Server is ready to receive contact form submissions\n`);
});
