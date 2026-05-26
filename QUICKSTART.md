# Contact Form - Quick Start Guide

## What Was Built

✅ **Frontend (index.html)**
- Contact form with email input, topic dropdown, message textarea
- Form validation and user feedback
- Responsive design that matches your website

✅ **Backend (server.js)**
- Express.js server with email sending via Nodemailer
- Gmail SMTP integration
- Rate limiting (5 requests/15 min) for security
- HTML email formatting
- Auto-reply confirmation emails

✅ **Documentation**
- Full setup guide (CONTACT_FORM_SETUP.md)
- Environment configuration (.env.example)

---

## 3-Step Quick Start

### 1. Gmail Setup (5 minutes)
1. Enable 2FA on your Google account
2. Generate an App Password in Gmail settings
3. Copy the 16-character password

### 2. Backend Setup (10 minutes)
```bash
# Install Node.js if not already installed
npm install
```

Create `.env` file (copy from `.env.example`):
```
EMAIL_USER=dodopower318@gmail.com
EMAIL_PASSWORD=YOUR_16_CHAR_APP_PASSWORD
RECIPIENT_EMAIL=dodopower318@gmail.com
FRONTEND_URL=http://localhost:3000
```

### 3. Run & Test (5 minutes)
```bash
npm start
```

Open your website, fill out the contact form, and check your inbox!

---

## Files Created

- **server.js** - Backend application
- **package.json** - Dependencies & scripts
- **.env.example** - Environment template
- **CONTACT_FORM_SETUP.md** - Full documentation
- **index.html** - Updated with contact form UI & JS

---

## Topic Categories Included

1. **💼 My Services** - Work opportunities
2. **🎯 Want to Hang Out** - Collaboration/social
3. **❓ Questions** - Feedback/questions
4. **🚀 Opportunities** - Interesting proposals
5. **📮 Other** - General inquiries

---

## Before Going Live

1. Deploy backend to production (Heroku/Railway/Replit)
2. Update API_URL in index.html to your live backend URL
3. Test the form end-to-end
4. Monitor emails for spam

See CONTACT_FORM_SETUP.md for deployment instructions →

---

## Security Features

✅ Server-side input validation
✅ Rate limiting (prevent spam)
✅ HTML escaping (prevent injection)
✅ CORS configuration
✅ Environment variables (no secrets in code)

---

## Need Help?

See **CONTACT_FORM_SETUP.md** for:
- Detailed setup instructions
- Troubleshooting
- Deployment options
- Production checklist
