## Sonsek Cleaning & Fumigation Services Website

Modern, fast, and mobile-friendly business website for **Sonsek Cleaning & Fumigation Services** based in Abuja, Nigeria.

### Tech Stack

- **Frontend**: Static HTML, CSS, vanilla JavaScript
- **Backend**: Node.js + Express (for secure form handling and email sending)
- **Email**: Nodemailer with your SMTP provider
- **Payments**: Paystack (or Flutterwave) inline JavaScript integration
- **Chat**: Tawk.to (or WhatsApp click-to-chat)

### Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Update `.env` with:

- SMTP credentials for sending emails
- Recipient email addresses (e.g. `info@sonsekcleaning.com`, `support@sonsekcleaning.com`)

3. **Run development server**

For a lightweight static dev server:

```bash
npm run dev
```

To run the Node backend (for forms + security headers) on port 4000:

```bash
npm start
```

Then open `http://localhost:4000` in your browser.

### Environment Variables

See `.env.example` for the full list. Key settings:

- `PORT` – server port (default `4000`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` – email SMTP
- `BOOKING_RECIPIENT_EMAIL` – where booking requests are sent
- `CONTACT_RECIPIENT_EMAIL` – where contact messages are sent
- `PAYSTACK_PUBLIC_KEY` – your Paystack public key (for client-side payments)

### SSL & Security

- Host this site on a platform that supports **HTTPS** (e.g. cPanel with SSL, Nginx/Apache with Let’s Encrypt, Netlify/Vercel + a simple API, or a Node host with TLS).
- The Express server:
  - Forces HTTPS when behind a proxy (using `x-forwarded-proto`).
  - Uses `helmet` to set modern, secure HTTP headers.

### Forms & Email Behaviour

- **Booking / Request Service form** (`booking.html`) posts to `/api/booking`.
- **Contact form** (`contact.html`) posts to `/api/contact`.
- Submissions are sent via **Nodemailer** to the configured company emails.

If you prefer a third-party form service (e.g. Formspree, Getform), you can:

- Change the form `action` URLs.
- Disable the local `/api/*` endpoints in `server.js`.

### Payments

- Paystack payment is integrated on the booking page via JavaScript.
- Configure your live Paystack key in `.env` (`PAYSTACK_PUBLIC_KEY`).
- For Flutterwave, you can add a similar inline script in `booking.html`.

### Live Chat & WhatsApp

- Add your **Tawk.to** property ID and widget code in `index.html` (and other pages if desired).
- WhatsApp click-to-chat button is configured to use the business number `09024524116`.

### SEO & Performance

- Every page has:
  - Descriptive **meta titles** and **descriptions**
  - Local SEO keywords for cleaning & fumigation in Abuja
  - Fast, mobile-first layout with minimal JavaScript
- The home page includes structured data (JSON-LD) for a local business.

### Company Emails

Recommended email accounts:

- `info@sonsekcleaning.com`
- `support@sonsekcleaning.com`

Set these up with your domain registrar/hosting provider and update `.env` and `contact.html` accordingly.

