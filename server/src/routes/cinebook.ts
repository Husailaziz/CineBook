import { Router } from 'express';
import { db } from '../db.js';

export const cinebookRouter = Router();

// GET all movies with optional filters
cinebookRouter.get('/movies', (req, res) => {
  try {
    const { cityId, genre, format, status, search } = req.query;
    const movies = db.getMovies({
      cityId: cityId as string,
      genre: genre as string,
      format: format as string,
      status: status as string,
      search: search as string
    });
    res.json({ success: true, count: movies.length, data: movies });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET movie by ID with cast and reviews
cinebookRouter.get('/movies/:id', (req, res) => {
  try {
    const movie = db.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }
    res.json({ success: true, data: movie });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST user rating and review
cinebookRouter.post('/movies/:id/reviews', (req, res) => {
  try {
    const { userName, rating, title, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, error: 'Rating and comment are required' });
    }
    const newReview = db.addReview(req.params.id, {
      userName: userName || 'Movie Buff',
      rating: Number(rating),
      title: title || 'Honest Review',
      comment
    });
    res.status(201).json({ success: true, data: newReview });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET cities
cinebookRouter.get('/cities', (req, res) => {
  try {
    const cities = db.getCities();
    res.json({ success: true, data: cities });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET theatres
cinebookRouter.get('/theatres', (req, res) => {
  try {
    const { cityId } = req.query;
    const theatres = db.getTheatres(cityId as string);
    res.json({ success: true, count: theatres.length, data: theatres });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET shows for a movie in a city on a specific date
cinebookRouter.get('/shows', (req, res) => {
  try {
    const { movieId, cityId, date } = req.query;
    if (!movieId) {
      return res.status(400).json({ success: false, error: 'movieId query parameter is required' });
    }
    const result = db.getShows(movieId as string, cityId as string, date as string);
    res.json({ success: true, data: result.theatres });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET seats layout & booked status for a show
cinebookRouter.get('/shows/:showId/seats', (req, res) => {
  try {
    const seatData = db.getShowSeats(req.params.showId);
    res.json({ success: true, data: seatData });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// GET snacks catalog
cinebookRouter.get('/snacks', (req, res) => {
  try {
    const snacks = db.getSnacks();
    res.json({ success: true, data: snacks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST verify promo code
cinebookRouter.post('/promos/verify', (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Promo code is required' });
    }
    const result = db.verifyPromo(code, Number(subtotal) || 0);
    res.json({ success: result.valid, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create booking
cinebookRouter.post('/bookings', (req, res) => {
  try {
    const booking = db.createBooking(req.body);
    res.status(201).json({ success: true, message: 'Ticket booked successfully!', data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET bookings history (optional email filter)
cinebookRouter.get('/bookings', (req, res) => {
  try {
    const { email } = req.query;
    const bookings = db.getBookings(email as string);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET booking details by ID or code
cinebookRouter.get('/bookings/:bookingId', (req, res) => {
  try {
    const booking = db.getBookingById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST cancel booking
cinebookRouter.post('/bookings/:bookingId/cancel', (req, res) => {
  try {
    const cancelled = db.cancelBooking(req.params.bookingId);
    res.json({ success: true, message: 'Booking cancelled and seats released', data: cancelled });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET stats summary
cinebookRouter.get('/stats', (req, res) => {
  try {
    const movies = db.getMovies();
    const cities = db.getCities();
    const theatres = db.getTheatres();
    const bookings = db.getBookings();
    res.json({
      success: true,
      data: {
        totalMovies: movies.length,
        nowShowing: movies.filter((m) => m.status === 'now_showing').length,
        comingSoon: movies.filter((m) => m.status === 'coming_soon').length,
        totalCities: cities.length,
        totalTheatres: theatres.length,
        totalBookings: bookings.length
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
