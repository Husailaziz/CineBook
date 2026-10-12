export type MovieStatus = 'now_showing' | 'coming_soon';

export interface CastMember {
  name: string;
  role: string;
  character: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  movieId: string;
  userName: string;
  rating: number; // 1 to 10
  title: string;
  comment: string;
  date: string;
  likes: number;
  tags?: string[];
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  hindiTitle?: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string; // YouTube embed or watch url
  trailerEmbedId?: string;
  rating: number; // e.g. 9.2
  votesCount: number; // e.g. 240000
  percentageLiked: number; // e.g. 94
  certificate: 'U' | 'U/A' | 'U/A 13+' | 'U/A 16+' | 'A';
  runtimeMinutes: number;
  runtimeFormatted: string; // e.g. "2h 35m"
  releaseDate: string; // ISO date or "15 Aug 2024"
  status: MovieStatus;
  languages: string[];
  formats: string[]; // ['2D', '3D', 'IMAX 2D', '4DX']
  genres: string[];
  synopsis: string;
  director: string;
  musicDirector?: string;
  producers?: string;
  cast: CastMember[];
  interestedCount?: number;
  isPopular?: boolean;
}

export interface City {
  id: string;
  name: string;
  state: string;
  isPopular: boolean;
  monumentIcon?: string;
}

export interface Theatre {
  id: string;
  name: string;
  chain: 'PVR' | 'INOX' | 'Cinepolis' | 'Miraj' | 'Carnival' | 'Independent';
  cityId: string;
  location: string;
  address: string;
  amenities: string[]; // e.g. ['Recliner', 'Dolby Atmos', 'M-Ticket', 'Food Court', 'Wheelchair Friendly']
  cancellationAvailable: boolean;
}

export interface SeatTierInfo {
  tier: 'RECLINER' | 'PRIME' | 'CLASSIC';
  label: string;
  price: number;
  rows: string[];
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screenName: string; // "Audi 1 - Dolby Atmos", "IMAX Screen 2"
  date: string; // YYYY-MM-DD
  time: string; // "10:15 AM", "01:45 PM"
  format: string; // '2D' | '3D' | 'IMAX 2D' | '4DX'
  language: string; // 'Hindi'
  seatTiers: SeatTierInfo[];
  fillingStatus: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL';
  totalSeats: number;
  availableSeats: number;
}

export interface Seat {
  id: string; // e.g. "F12"
  row: string; // "F"
  number: number; // 12
  tier: 'RECLINER' | 'PRIME' | 'CLASSIC';
  price: number;
  status: 'available' | 'booked' | 'selected';
}

export interface SnackItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Popcorn' | 'Combos' | 'Beverages' | 'Quick Bites';
  imageUrl: string;
  isVeg: boolean;
}

export interface BookingSnack {
  snackId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingRequest {
  showId: string;
  seatIds: string[];
  snacks?: BookingSnack[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  promoCode?: string;
  donationOptIn?: boolean;
  paymentMethod?: string;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "CNBK-89342"
  showId: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieCertificate: string;
  theatreId: string;
  theatreName: string;
  theatreLocation: string;
  screenName: string;
  showDate: string;
  showTime: string;
  format: string;
  language: string;
  seatIds: string[];
  seatTier: string;
  ticketsAmount: number;
  convenienceFee: number;
  convenienceFeeGst: number;
  snacks: BookingSnack[];
  snacksAmount: number;
  discountAmount: number;
  promoCodeApplied?: string;
  donationAmount: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  bookedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
  qrCodeUrl: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minAmount: number;
  maxDiscount?: number;
  description: string;
}
