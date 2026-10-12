import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Movie,
  City,
  Theatre,
  Show,
  Seat,
  SnackItem,
  PromoCode,
  Booking,
  Review,
  BookingRequest,
  SeatTierInfo
} from './types.js';
import {
  INITIAL_MOVIES,
  INITIAL_CITIES,
  INITIAL_THEATRES,
  INITIAL_SNACKS,
  INITIAL_PROMOS,
  INITIAL_REVIEWS
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'cinebook-database.json');

interface DatabaseSchema {
  movies: Movie[];
  cities: City[];
  theatres: Theatre[];
  shows: Show[];
  bookedSeatsByShow: Record<string, string[]>; // showId -> ['A1', 'A2', ...]
  bookings: Booking[];
  reviews: Review[];
  snacks: SnackItem[];
  promos: PromoCode[];
}

// Generate upcoming dates in YYYY-MM-DD
function getUpcomingDates(daysCount = 7): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// Generate realistic shows for each active movie across theatres
function generateInitialShows(movies: Movie[], theatres: Theatre[]): Show[] {
  const shows: Show[] = [];
  const dates = getUpcomingDates(7);
  const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');

  const standardTiers: SeatTierInfo[] = [
    { tier: 'RECLINER', label: 'RECLINER (Luxury Lounger)', price: 650, rows: ['A', 'B'] },
    { tier: 'PRIME', label: 'PRIME (Prime Experience)', price: 350, rows: ['C', 'D', 'E', 'F'] },
    { tier: 'CLASSIC', label: 'CLASSIC (Cinema Seating)', price: 220, rows: ['G', 'H', 'J', 'K'] }
  ];

  const imaxTiers: SeatTierInfo[] = [
    { tier: 'RECLINER', label: 'IMAX RECLINER', price: 800, rows: ['A', 'B'] },
    { tier: 'PRIME', label: 'IMAX PRIME', price: 480, rows: ['C', 'D', 'E', 'F'] },
    { tier: 'CLASSIC', label: 'IMAX CLASSIC', price: 320, rows: ['G', 'H', 'J', 'K'] }
  ];

  const timeSlots = [
    '09:45 AM',
    '12:30 PM',
    '03:45 PM',
    '06:45 PM',
    '09:30 PM',
    '11:15 PM'
  ];

  theatres.forEach((theatre) => {
    // Each theatre features 3-5 now showing movies
    nowShowingMovies.forEach((movie, mIdx) => {
      // Pick 2-4 time slots for this movie in this theatre
      const assignedSlots = timeSlots.filter((_, idx) => (idx + mIdx) % 2 === 0);

      dates.forEach((date) => {
        assignedSlots.forEach((slot, slotIdx) => {
          const isImax = theatre.amenities.includes('IMAX') && movie.formats.includes('IMAX 2D') && slotIdx % 2 === 0;
          const format = isImax ? 'IMAX 2D' : movie.formats.includes('4DX') && theatre.amenities.includes('4DX') ? '4DX' : '2D';
          const tiers = isImax ? imaxTiers : standardTiers;
          const showId = `show-${theatre.id}-${movie.id}-${date}-${slot.replace(/[: ]/g, '')}`;

          // Randomize filling status realistically
          const fillRand = Math.random();
          const fillingStatus: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL' =
            fillRand > 0.7 ? 'ALMOST_FULL' : fillRand > 0.35 ? 'FILLING_FAST' : 'AVAILABLE';

          shows.push({
            id: showId,
            movieId: movie.id,
            theatreId: theatre.id,
            screenName: isImax ? 'Audi 1 - IMAX Laser with Dolby Atmos' : `Screen ${(mIdx % 3) + 1} - 4K Dolby 7.1`,
            date,
            time: slot,
            format,
            language: 'Hindi',
            seatTiers: tiers,
            fillingStatus,
            totalSeats: 160,
            availableSeats: fillingStatus === 'ALMOST_FULL' ? 18 : fillingStatus === 'FILLING_FAST' ? 62 : 124
          });
        });
      });
    });
  });

  return shows;
}

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.movies && parsed.shows) {
          return parsed;
        }
      } catch (err) {
        console.warn('Could not read existing database, re-initializing from seed:', err);
      }
    }

    // Initialize fresh DB from seed
    const initialShows = generateInitialShows(INITIAL_MOVIES, INITIAL_THEATRES);

    // Pre-populate some realistic booked seats for demo realism
    const initialBookedSeats: Record<string, string[]> = {};
    initialShows.forEach((show) => {
      // mark 8-15 random seats as occupied
      const occupied: string[] = [];
      const sampleSeats = ['C8', 'C9', 'D10', 'D11', 'E6', 'E7', 'F8', 'F9', 'F10', 'G12', 'G13'];
      const count = show.fillingStatus === 'ALMOST_FULL' ? 10 : show.fillingStatus === 'FILLING_FAST' ? 6 : 2;
      for (let i = 0; i < count; i++) {
        occupied.push(sampleSeats[i]);
      }
      initialBookedSeats[show.id] = occupied;
    });

    const initialDb: DatabaseSchema = {
      movies: INITIAL_MOVIES,
      cities: INITIAL_CITIES,
      theatres: INITIAL_THEATRES,
      shows: initialShows,
      bookedSeatsByShow: initialBookedSeats,
      bookings: [
        {
          id: 'booking-seed-1',
          bookingCode: 'CNBK-78912-MUM',
          showId: initialShows[0]?.id || 'show-1',
          movieId: 'stree-2',
          movieTitle: 'Stree 2: Sarkate Ka Aatank',
          moviePoster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
          movieCertificate: 'U/A 16+',
          theatreId: 'th-mum-pvr-palladium',
          theatreName: 'PVR: Phoenix Palladium, Lower Parel',
          theatreLocation: 'Lower Parel, Mumbai',
          screenName: 'Audi 1 - IMAX Laser with Dolby Atmos',
          showDate: getUpcomingDates(1)[0],
          showTime: '06:45 PM',
          format: 'IMAX 2D',
          language: 'Hindi',
          seatIds: ['E10', 'E11'],
          seatTier: 'PRIME',
          ticketsAmount: 700,
          convenienceFee: 70,
          convenienceFeeGst: 12.6,
          snacks: [
            {
              snackId: 'snack-cheese-popcorn',
              name: 'Cinebook Cheese Popcorn (Tub)',
              price: 290,
              quantity: 1
            }
          ],
          snacksAmount: 290,
          discountAmount: 100,
          promoCodeApplied: 'CINEBOOK100',
          donationAmount: 2,
          totalAmount: 974.6,
          customerName: 'Aman Sharma',
          customerEmail: 'aman.sharma@example.com',
          customerPhone: '9876543210',
          paymentStatus: 'COMPLETED',
          paymentMethod: 'UPI (Google Pay)',
          bookedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          status: 'CONFIRMED',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CINEBOOK-TICKET-CNBK-78912-MUM-AMAN'
        }
      ],
      reviews: INITIAL_REVIEWS,
      snacks: INITIAL_SNACKS,
      promos: INITIAL_PROMOS
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  private saveDatabase() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to database file:', err);
    }
  }

  // Movies
  public getMovies(filters?: {
    cityId?: string;
    genre?: string;
    format?: string;
    status?: string;
    search?: string;
  }): Movie[] {
    let list = [...this.data.movies];

    if (filters?.status) {
      list = list.filter((m) => m.status === filters.status);
    }

    if (filters?.genre && filters.genre !== 'All') {
      list = list.filter((m) =>
        m.genres.some((g) => g.toLowerCase() === filters.genre!.toLowerCase())
      );
    }

    if (filters?.format && filters.format !== 'All Formats') {
      list = list.filter((m) =>
        m.formats.some((f) => f.toLowerCase() === filters.format!.toLowerCase())
      );
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.name.toLowerCase().includes(q)) ||
          m.director.toLowerCase().includes(q)
      );
    }

    return list;
  }

  public getMovieById(id: string): (Movie & { reviews: Review[] }) | null {
    const movie = this.data.movies.find((m) => m.id === id || m.slug === id);
    if (!movie) return null;
    const reviews = this.data.reviews.filter((r) => r.movieId === movie.id);
    return { ...movie, reviews };
  }

  public addReview(
    movieId: string,
    reviewData: { userName: string; rating: number; title: string; comment: string }
  ): Review {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      movieId,
      userName: reviewData.userName || 'Movie Buff',
      rating: Math.min(10, Math.max(1, reviewData.rating)),
      title: reviewData.title,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      likes: 0,
      tags: ['Audience Review']
    };

    this.data.reviews.unshift(newReview);

    // Recalculate average rating of the movie
    const movie = this.data.movies.find((m) => m.id === movieId);
    if (movie) {
      movie.votesCount += 1;
      const allMovieReviews = this.data.reviews.filter((r) => r.movieId === movieId);
      const avg = allMovieReviews.reduce((sum, r) => sum + r.rating, 0) / allMovieReviews.length;
      movie.rating = +(avg.toFixed(1));
    }

    this.saveDatabase();
    return newReview;
  }

  // Cities
  public getCities(): City[] {
    return this.data.cities;
  }

  // Theatres
  public getTheatres(cityId?: string): Theatre[] {
    if (cityId) {
      return this.data.theatres.filter((t) => t.cityId.toLowerCase() === cityId.toLowerCase());
    }
    return this.data.theatres;
  }

  // Shows
  public getShows(movieId: string, cityId?: string, date?: string): {
    theatres: Array<Theatre & { shows: Show[] }>;
  } {
    let filteredShows = this.data.shows.filter((s) => s.movieId === movieId);

    if (date) {
      filteredShows = filteredShows.filter((s) => s.date === date);
    } else {
      // Default to today
      const today = getUpcomingDates(1)[0];
      filteredShows = filteredShows.filter((s) => s.date === today);
    }

    // Filter by city theatres
    let theatres = this.getTheatres(cityId);

    const result = theatres
      .map((theatre) => {
        const theatreShows = filteredShows.filter((s) => s.theatreId === theatre.id);
        return {
          ...theatre,
          shows: theatreShows
        };
      })
      .filter((t) => t.shows.length > 0);

    return { theatres: result };
  }

  public getShowById(showId: string): Show | null {
    return this.data.shows.find((s) => s.id === showId) || null;
  }

  // Seat Grid Generation with Booked status
  public getShowSeats(showId: string): {
    show: Show;
    movie: Movie;
    theatre: Theatre;
    seatsByTier: Record<string, { tier: string; price: number; rows: Record<string, Seat[]> }>;
    bookedSeats: string[];
  } {
    const show = this.getShowById(showId);
    if (!show) {
      throw new Error('Show not found');
    }

    const movie = this.data.movies.find((m) => m.id === show.movieId)!;
    const theatre = this.data.theatres.find((t) => t.id === show.theatreId)!;
    const bookedList = this.data.bookedSeatsByShow[showId] || [];

    const seatsByTier: Record<string, { tier: string; price: number; rows: Record<string, Seat[]> }> = {};

    show.seatTiers.forEach((tierInfo) => {
      const tierRows: Record<string, Seat[]> = {};

      tierInfo.rows.forEach((rowLetter) => {
        const rowSeats: Seat[] = [];
        const seatsInRow = tierInfo.tier === 'RECLINER' ? 12 : 16;

        for (let num = 1; num <= seatsInRow; num++) {
          const seatId = `${rowLetter}${num}`;
          const isBooked = bookedList.includes(seatId);

          rowSeats.push({
            id: seatId,
            row: rowLetter,
            number: num,
            tier: tierInfo.tier,
            price: tierInfo.price,
            status: isBooked ? 'booked' : 'available'
          });
        }
        tierRows[rowLetter] = rowSeats;
      });

      seatsByTier[tierInfo.tier] = {
        tier: tierInfo.label,
        price: tierInfo.price,
        rows: tierRows
      };
    });

    return {
      show,
      movie,
      theatre,
      seatsByTier,
      bookedSeats: bookedList
    };
  }

  // Snacks & Promos
  public getSnacks(): SnackItem[] {
    return this.data.snacks;
  }

  public verifyPromo(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
    const promo = this.data.promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (subtotal < promo.minAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ₹${promo.minAmount} required for this coupon`
      };
    }

    let discount = 0;
    if (promo.discountType === 'flat') {
      discount = promo.value;
    } else {
      discount = (subtotal * promo.value) / 100;
      if (promo.maxDiscount) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    }

    return {
      valid: true,
      discount: Math.round(discount),
      message: `Coupon '${promo.code}' applied! You save ₹${Math.round(discount)}`
    };
  }

  // Booking Creation
  public createBooking(req: BookingRequest): Booking {
    const show = this.getShowById(req.showId);
    if (!show) {
      throw new Error('Show not found');
    }

    const movie = this.data.movies.find((m) => m.id === show.movieId);
    if (!movie) {
      throw new Error('Movie not found');
    }

    const theatre = this.data.theatres.find((t) => t.id === show.theatreId);
    if (!theatre) {
      throw new Error('Theatre not found');
    }

    if (!req.seatIds || req.seatIds.length === 0) {
      throw new Error('Please select at least one seat');
    }

    // Check if seats already booked
    const currentBooked = this.data.bookedSeatsByShow[show.id] || [];
    const alreadyBooked = req.seatIds.filter((s) => currentBooked.includes(s));
    if (alreadyBooked.length > 0) {
      throw new Error(`Seats ${alreadyBooked.join(', ')} are already booked. Please choose other seats.`);
    }

    // Calculate ticket amounts based on tiers
    let ticketsAmount = 0;
    let detectedTier = 'CLASSIC';

    req.seatIds.forEach((seatId) => {
      const row = seatId[0];
      const matchedTier = show.seatTiers.find((t) => t.rows.includes(row)) || show.seatTiers[show.seatTiers.length - 1];
      ticketsAmount += matchedTier.price;
      detectedTier = matchedTier.tier;
    });

    // Convenience fee: ₹35 per ticket + 18% GST
    const baseConvenience = req.seatIds.length * 35;
    const convenienceGst = +(baseConvenience * 0.18).toFixed(2);

    // Snacks
    const snacks = req.snacks || [];
    const snacksAmount = snacks.reduce((sum, s) => sum + s.price * s.quantity, 0);

    // Promo code discount
    let discountAmount = 0;
    let promoCodeApplied: string | undefined = undefined;
    if (req.promoCode) {
      const promoCheck = this.verifyPromo(req.promoCode, ticketsAmount + snacksAmount);
      if (promoCheck.valid) {
        discountAmount = promoCheck.discount;
        promoCodeApplied = req.promoCode.toUpperCase();
      }
    }

    const donationAmount = req.donationOptIn ? 2 : 0;
    const totalAmount = Math.max(0, +(ticketsAmount + baseConvenience + convenienceGst + snacksAmount + donationAmount - discountAmount).toFixed(2));

    const bookingRandom = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `CNBK-${bookingRandom}-${theatre.cityId.substring(0, 3).toUpperCase()}`;
    const bookingId = `book-${Date.now()}`;

    // Mark seats as booked
    this.data.bookedSeatsByShow[show.id] = [...currentBooked, ...req.seatIds];
    show.availableSeats = Math.max(0, show.availableSeats - req.seatIds.length);
    if (show.availableSeats < 10) {
      show.fillingStatus = 'ALMOST_FULL';
    } else if (show.availableSeats < 50) {
      show.fillingStatus = 'FILLING_FAST';
    }

    const qrCodeData = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=CINEBOOK-VERIFIED-${bookingCode}-${req.customerName.replace(/ /g, '_')}`;

    const newBooking: Booking = {
      id: bookingId,
      bookingCode,
      showId: show.id,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      movieCertificate: movie.certificate,
      theatreId: theatre.id,
      theatreName: theatre.name,
      theatreLocation: theatre.location,
      screenName: show.screenName,
      showDate: show.date,
      showTime: show.time,
      format: show.format,
      language: show.language,
      seatIds: req.seatIds,
      seatTier: detectedTier,
      ticketsAmount,
      convenienceFee: baseConvenience,
      convenienceFeeGst: convenienceGst,
      snacks,
      snacksAmount,
      discountAmount,
      promoCodeApplied,
      donationAmount,
      totalAmount,
      customerName: req.customerName,
      customerEmail: req.customerEmail,
      customerPhone: req.customerPhone,
      paymentStatus: 'COMPLETED',
      paymentMethod: req.paymentMethod || 'UPI (Google Pay)',
      bookedAt: new Date().toISOString(),
      status: 'CONFIRMED',
      qrCodeUrl: qrCodeData
    };

    this.data.bookings.unshift(newBooking);
    this.saveDatabase();

    return newBooking;
  }

  public getBookings(email?: string): Booking[] {
    if (email) {
      return this.data.bookings.filter((b) => b.customerEmail.toLowerCase() === email.toLowerCase());
    }
    return this.data.bookings;
  }

  public getBookingById(bookingId: string): Booking | null {
    return (
      this.data.bookings.find(
        (b) => b.id === bookingId || b.bookingCode.toUpperCase() === bookingId.toUpperCase()
      ) || null
    );
  }

  public cancelBooking(bookingId: string): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'CANCELLED') {
      throw new Error('Booking is already cancelled');
    }

    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';

    // Release booked seats
    const currentSeats = this.data.bookedSeatsByShow[booking.showId] || [];
    this.data.bookedSeatsByShow[booking.showId] = currentSeats.filter((s) => !booking.seatIds.includes(s));

    const show = this.getShowById(booking.showId);
    if (show) {
      show.availableSeats += booking.seatIds.length;
    }

    this.saveDatabase();
    return booking;
  }
}

export const db = new DatabaseManager();
