import {
  Movie,
  City,
  Theatre,
  Show,
  Seat,
  SnackItem,
  Booking,
  BookingRequest,
  Review
} from '../types';

const API_BASE = '/api';

export const cinebookApi = {
  // Movies
  async getMovies(filters?: {
    cityId?: string;
    genre?: string;
    format?: string;
    status?: string;
    search?: string;
  }): Promise<Movie[]> {
    const params = new URLSearchParams();
    if (filters?.cityId) params.append('cityId', filters.cityId);
    if (filters?.genre && filters.genre !== 'All') params.append('genre', filters.genre);
    if (filters?.format && filters.format !== 'All Formats') params.append('format', filters.format);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/movies?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async getMovieById(id: string): Promise<Movie & { reviews: Review[] }> {
    const res = await fetch(`${API_BASE}/movies/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch movie');
    return data.data;
  },

  async addReview(
    movieId: string,
    review: { userName: string; rating: number; title: string; comment: string }
  ): Promise<Review> {
    const res = await fetch(`${API_BASE}/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data.data;
  },

  // Cities
  async getCities(): Promise<City[]> {
    const res = await fetch(`${API_BASE}/cities`);
    const data = await res.json();
    return data.data || [];
  },

  // Theatres
  async getTheatres(cityId?: string): Promise<Theatre[]> {
    const res = await fetch(`${API_BASE}/theatres${cityId ? `?cityId=${cityId}` : ''}`);
    const data = await res.json();
    return data.data || [];
  },

  // Shows
  async getShows(
    movieId: string,
    cityId?: string,
    date?: string
  ): Promise<Array<Theatre & { shows: Show[] }>> {
    const params = new URLSearchParams({ movieId });
    if (cityId) params.append('cityId', cityId);
    if (date) params.append('date', date);

    const res = await fetch(`${API_BASE}/shows?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  // Seats
  async getShowSeats(showId: string): Promise<{
    show: Show;
    movie: Movie;
    theatre: Theatre;
    seatsByTier: Record<string, { tier: string; price: number; rows: Record<string, Seat[]> }>;
    bookedSeats: string[];
  }> {
    const res = await fetch(`${API_BASE}/shows/${showId}/seats`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch seats');
    return data.data;
  },

  // Snacks
  async getSnacks(): Promise<SnackItem[]> {
    const res = await fetch(`${API_BASE}/snacks`);
    const data = await res.json();
    return data.data || [];
  },

  // Promo code
  async verifyPromo(
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; discount: number; message: string }> {
    const res = await fetch(`${API_BASE}/promos/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return await res.json();
  },

  // Booking
  async createBooking(bookingReq: BookingRequest): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingReq)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking failed');
    return data.data;
  },

  async getBookings(email?: string): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    const data = await res.json();
    return data.data || [];
  },

  async getBookingById(bookingId: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking not found');
    return data.data;
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');
    return data.data;
  }
};
