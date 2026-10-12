# 🎬 Cinebook — Hindi Movie Ticket Booking Platform

> A comprehensive, full-stack Hindi movie ticket booking web application inspired by [BookMyShow](https://in.bookmyshow.com). Cinebook features real-time multiplex showtimes, interactive cinema seat layouts, food & beverage combos, instant promo code discounts, and digital M-Tickets with scannable QR codes.

---

## 🌟 Key Features (Inspired by BookMyShow)

1. **City Selection Modal**:
   - Multi-city support across India (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Ahmedabad, Pune, Kolkata, Jaipur, Chandigarh, Lucknow).
   - Popular city quick chips with monument emblems and instant search filtering.
   - City preference automatically saved in local storage.

2. **Extensive Hindi Movies Database**:
   - Seeded with Bollywood blockbusters and upcoming tentpole releases:
     - *Stree 2: Sarkate Ka Aatank* (Horror / Comedy)
     - *Jawan* (Action / Thriller)
     - *Fighter* (Aerial Action)
     - *Animal* (Action / Drama)
     - *12th Fail* (Inspirational / Drama)
     - *Shaitaan* (Supernatural Thriller)
     - *Bhool Bhulaiyaa 3* (Horror / Comedy)
     - *Singham Again* (Cop Universe)
     - *Brahmāstra: Part One – Shiva* (Fantasy / Adventure)
     - *Chhaava* (Upcoming Historical Epic)
     - *War 2* (Upcoming Spy Action)
   - High-definition posters, backdrops, real cast and crew profiles, runtime, certificates (U, U/A, A), user reviews, and YouTube trailer popups.

3. **Multiplex & Showtimes Explorer**:
   - Partner cinema chains: PVR Cinemas, INOX Megaplex, Cinépolis India, and Miraj Cinemas.
   - 7-day horizontal calendar picker (Today, Tomorrow, and upcoming dates).
   - Filter showtimes by Price Range (₹0-250, ₹250-450, ₹450+), Timing (Morning, Afternoon, Evening, Night), and Format (2D, IMAX 2D Laser, 4DX).
   - Color-coded availability indicators: Green (Available), Amber (Filling Fast), Rose (Almost Full).

4. **Interactive Cinema Seat Matrix**:
   - Screen visualization with realistic curved luminescence (`ALL EYES THIS WAY`).
   - Distinct seat tiers:
     - **RECLINER** (Luxury leather loungers: Rows A & B)
     - **PRIME / PLATINUM** (Optimal viewing angles: Rows C, D, E, F)
     - **CLASSIC / SILVER** (Standard cinema seating: Rows G, H, J, K)
   - Seat selection target switcher (1 to 10 seats).
   - Real-time live seat locking — seats reserved by users cannot be double-booked.

5. **Food & Beverage (F&B) Add-on Counter**:
   - Pre-order gourmet theater snacks at discounted prices:
     - Cinebook Cheese Popcorn Tub
     - Golden Salted Popcorn (Jumbo)
     - Artisanal Caramel Crunch Popcorn
     - Mexican Nachos with Warm Cheese Dip & Salsa
     - Punjabi Samosa Duo + Mint Chutney
     - Chilled Pepsi / Coca-Cola Zero Sugar
     - Blockbuster Duo Combos

6. **Checkout & Instant Discount Coupons**:
   - Transparent price breakdown: Base ticket price, Convenience Fee (₹35/ticket) + 18% GST, Snacks subtotal, BookASmile charity donation (+₹2).
   - Promo Codes:
     - `CINEBOOK100` — Flat ₹100 Off on orders above ₹350
     - `BOLLYWOOD50` — Flat ₹50 Off on any Hindi movie
     - `CINEVIP20` — 20% Off up to ₹150
     - `ICICIBOGO` — Flat ₹180 Off on card checkout
   - Payment Simulation: UPI (Google Pay, PhonePe, Paytm QR code), Debit/Credit Cards, Net Banking.

7. **Official Digital M-Ticket & Entry QR Pass**:
   - Festive booking confirmation screen with confetti animation.
   - Real scannable-looking turnstile entry QR code.
   - Detailed PNR reference code (`CNBK-XXXXX-MUM`), theatre name, screen, showtime, and seat category.
   - Print / Save as PDF ticket support.
   - Share ticket pass via WhatsApp.

8. **My Bookings & Cancellation Management**:
   - Persistent booking history in database.
   - View active confirmed tickets anytime.
   - One-click ticket cancellation that releases seats back into auditorium availability and issues refund.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Canvas Confetti, Wouter (lightweight client routing).
- **Backend**: Node.js, Express.js, TypeScript, REST API with JSON persistence (`server/data/cinebook-database.json`).
- **Tooling**: Vite 6, tsx watch, PostCSS, Concurrently.

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend in Development Mode
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API Server**: `http://localhost:5000`

### 3. API Endpoints
- `GET /api/movies` — List movies (filters: `genre`, `format`, `status`, `search`)
- `GET /api/movies/:id` — Movie details, cast, and user reviews
- `POST /api/movies/:id/reviews` — Add user rating and review
- `GET /api/cities` — Supported Indian cities
- `GET /api/shows?movieId=...&cityId=...&date=...` — Shows grouped by theatre
- `GET /api/shows/:showId/seats` — Seat matrix and real-time booked seats
- `GET /api/snacks` — Food & beverage catalog
- `POST /api/promos/verify` — Validate promo code
- `POST /api/bookings` — Create confirmed booking and generate M-ticket
- `GET /api/bookings` — Retrieve user booking history
- `POST /api/bookings/:id/cancel` — Cancel booking and release seats
