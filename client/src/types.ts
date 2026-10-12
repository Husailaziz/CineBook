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
  rating: number;
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
  trailerUrl: string;
  trailerEmbedId?: string;
  rating: number;
  votesCount: number;
  percentageLiked: number;
  certificate: 'U' | 'U/A' | 'U/A 13+' | 'U/A 16+' | 'A';
  runtimeMinutes: number;
  runtimeFormatted: string;
  releaseDate: string;
  status: MovieStatus;
  languages: string[];
  formats: string[];
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
  amenities: string[];
  cancellationAvailable: boolean;
  shows?: Show[];
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
  screenName: string;
  date: string;
  time: string;
  format: string;
  language: string;
  seatTiers: SeatTierInfo[];
  fillingStatus: 'AVAILABLE' | 'FILLING_FAST' | 'ALMOST_FULL';
  totalSeats: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
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
  bookingCode: string;
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
