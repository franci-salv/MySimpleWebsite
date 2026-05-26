# Contact Form Setup Guide

## Overview
Your website now has a fully functional contact form with backend email integration. Messages from visitors will be sent directly to your Gmail inbox.

---

## Part 1: Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication (2FA)
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left menu
3. Under "How you sign in to Google", enable **2-Step Verification** if not already enabled
   - Follow Google's prompts to complete the setup

### Step 2: Create App Password
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Scroll down to **App passwords** (only visible if 2FA is enabled)
3. Select:
   - **App**: Mail
   - **Device**: Windows PC (or your device type)
4. Google will generate a 16-character password like: `abcd efgh ijkl mnop`
5. **Copy this password** - you'll need it in Step 3

---

## Part 2: Backend Installation & Configuration

### Step 1: Install Node.js
- Download from [nodejs.org](https://nodejs.org) (LTS version recommended)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### Step 2: Clone/Setup Backend Files
Your backend files are already in this directory:
- `server.js` - Main backend application
- `package.json` - Dependencies list
- `.env.example` - Environment variables template

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Create .env File
1. Duplicate `.env.example` and rename to `.env`
2. Fill in your configuration:
   ```
   PORT=3000
   NODE_ENV=development
   EMAIL_USER=dodopower318@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   RECIPIENT_EMAIL=dodopower318@gmail.com
   FRONTEND_URL=http://localhost:3000
   ```

### Step 5: Test the Backend Locally
```bash
npm start
```

You should see:
```
🚀 Contact Form Server running on http://localhost:3000
📧 Emails will be sent to: dodopower318@gmail.com
✅ Server is ready to receive contact form submissions
```

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

---

## Part 3: Frontend Configuration

### Update API URL
In `index.html`, find the contact form JavaScript section and update:

```javascript
const API_URL = 'http://localhost:3000/api/contact'; // For local testing
// Change to your deployed URL for production:
// const API_URL = 'https://your-server-url.com/api/contact';
```

---

## Part 4: Testing the Form

1. **Start the backend**: `npm start`
2. **Open your website** in a browser
3. **Scroll to Contact section**
4. Fill in the form:
   - Email: Use a test email
   - Topic: Select one
   - Message: Type a test message (min 10 characters)
5. Click **Send Message**
6. You should see a success message
7. Check your `dodopower318@gmail.com` inbox for the message

---

## Part 5: Deployment Options

Choose one of these hosting options to run your backend 24/7:

### Option A: Heroku (Recommended for beginners)
1. Create account at [heroku.com](https://heroku.com)
2. Install Heroku CLI: [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
3. Login: `heroku login`
4. Create app: `heroku create your-app-name`
5. Set environment variables:
   ```bash
   heroku config:set EMAIL_USER=dodopower318@gmail.com
   heroku config:set EMAIL_PASSWORD="abcd efgh ijkl mnop"
   heroku config:set RECIPIENT_EMAIL=dodopower318@gmail.com
   heroku config:set FRONTEND_URL=https://franci-salv.github.io
   ```
6. Deploy: `git push heroku main`
7. Your backend URL will be: `https://your-app-name.herokuapp.com`

### Option B: Railway
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically
5. Get your deployment URL from Railway dashboard

### Option C: Replit
1. Create account at [replit.com](https://replit.com)
2. Click "Create" → "Import from GitHub"
3. Paste your repository URL
4. Add environment variables in Secrets
5. Run with `npm start`
6. Replit provides a public URL

### Option D: AWS, Google Cloud, Azure
For more advanced deployments, check their documentation.

---

## Part 6: Final Configuration

### Update Frontend API URL
Once deployed, update the API URL in `index.html`:

```javascript
const API_URL = 'https://your-deployed-url.com/api/contact';
```

For GitHub Pages (your current setup), you may need to:
1. Host the backend separately (one of the options above)
2. Update the frontend API URL to point to your deployed backend
3. Ensure CORS is configured correctly (it is in server.js)

---

## Features Included

✅ **Form Validation**
- Email format validation
- Message length check (10-5000 characters)
- Topic selection required
- Client-side and server-side validation

✅ **Email Features**
- Formatted HTML emails with metadata
- Auto-reply confirmation email to user
- Reply-to functionality
- Organized subject lines with topic

✅ **Security**
- Rate limiting (5 requests per 15 minutes)
- HTML escaping to prevent injection
- CORS configuration
- Environment variables for sensitive data
- Input validation

✅ **User Experience**
- Loading state during submission
- Success/error messages
- Auto-clear form on success
- Responsive design
- Accessibility features

---

## Troubleshooting

### "Can't connect to backend"
- Ensure backend is running: `npm start`
- Check the API_URL in index.html matches your backend URL
- Check CORS configuration in server.js
- Verify firewall isn't blocking the port

### "Gmail authentication failed"
- Verify 2FA is enabled
- Check Email Password is correct (16 characters)
- Ensure EMAIL_USER matches your Gmail address
- Try creating a new App Password

### "Emails not being sent"
- Check server logs for errors
- Verify .env file has correct values
- Test with: `curl -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"email":"test@example.com","topic":"services","message":"This is a test message"}'`
- Check RECIPIENT_EMAIL is correct

### "Rate limited"
- Backend limits 5 emails per 15 minutes per IP
- Wait before trying again
- Modify `max` value in server.js if needed

---

## Production Checklist

Before going live:
- [ ] Test the entire form workflow
- [ ] Verify emails are received
- [ ] Update API_URL to production URL
- [ ] Set NODE_ENV=production in backend
- [ ] Enable HTTPS (all hosting options support this)
- [ ] Test confirmation email
- [ ] Monitor server logs
- [ ] Set up backups
- [ ] Test on mobile devices
- [ ] Add custom domain if desired

---

## Next Steps (Optional Enhancements)

- Add CAPTCHA (Google reCAPTCHA) for spam prevention
- Store messages in a database (MongoDB)
- Add email templates for different topics
- Implement message notifications (Discord, Slack)
- Add file upload support
- Create admin dashboard to view messages
- Add automatic email scheduling

---

## Support

For issues with:
- **Node.js/npm**: See [nodejs.org documentation](https://nodejs.org/en/docs/)
- **Nodemailer**: See [nodemailer.com](https://nodemailer.com/)
- **Express**: See [expressjs.com](https://expressjs.com/)
- **Hosting**: Check your provider's documentation
- **Gmail issues**: Check [Google Account Help](https://support.google.com/accounts)

---

Good luck with your contact form! 🚀
