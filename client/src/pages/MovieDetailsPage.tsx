import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import {
  Star,
  Play,
  Film,
  Calendar,
  Clock,
  Share2,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { cinebookApi } from '../api/cinebookApi';
import { Movie, Review } from '../types';
import { TrailerModal } from '../components/common/TrailerModal';
import { ReviewModal } from '../components/common/ReviewModal';

export const MovieDetailsPage: React.FC = () => {
  const [, params] = useRoute('/movie/:id');
  const [, setLocation] = useLocation();
  const movieId = params?.id || 'stree-2';

  const [movie, setMovie] = useState<(Movie & { reviews: Review[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Thumbs up local tracker
  const [likedReviews, setLikedReviews] = useState<Record<string, number>>({});

  useEffect(() => {
    setIsLoading(true);
    cinebookApi
      .getMovieById(movieId)
      .then((data) => setMovie(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [movieId]);

  const handleReviewAdded = (newReview: Review) => {
    if (movie) {
      setMovie({
        ...movie,
        votesCount: movie.votesCount + 1,
        reviews: [newReview, ...movie.reviews]
      });
    }
  };

  const handleLikeReview = (reviewId: string, currentLikes: number) => {
    setLikedReviews((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || currentLikes) + 1
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#10111a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#f84464] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading Hindi movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md">
          <Film className="w-12 h-12 text-[#f84464] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Movie Not Found</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            The requested movie could not be located in the Cinebook database.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-[#f84464] text-white text-xs font-bold inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* 1. Cinematic Hero Header Banner */}
      <section className="relative bg-[#10111a] text-white overflow-hidden">
        {/* Backdrop Stills with Dark Blur Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center opacity-25 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10111a] via-[#10111a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10111a] via-[#10111a]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Movie Poster */}
            <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
              <div className="relative group">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-60 sm:w-72 aspect-[2/3] object-cover rounded-2xl shadow-2xl border-2 border-white/10"
                />
                <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-md rounded-xl p-2 text-center text-xs font-bold text-[#f84464]">
                  In Cinemas Now
                </div>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="md:col-span-8 lg:col-span-9 space-y-5">
              <div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
                  {movie.title}
                </h1>
                {movie.hindiTitle && (
                  <p className="text-xl sm:text-2xl font-bold text-gray-400 mt-1 font-display">
                    {movie.hindiTitle}
                  </p>
                )}
              </div>

              {/* Rating Card (BookMyShow style) */}
              <div className="p-4 rounded-2xl bg-[#1d1f2e] border border-white/10 max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Star className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">{movie.rating}</span>
                      <span className="text-sm text-gray-400 font-semibold">/ 10</span>
                      <span className="text-xs text-[#f84464] font-bold ml-1">
                        ({(movie.votesCount / 1000).toFixed(0)}K+ Votes)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {movie.percentageLiked}% of Cinebook viewers loved this movie
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Rate Now
                </button>
              </div>

              {/* Badges: Format & Language */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                  <span className="text-gray-400">Formats:</span>
                  <div className="flex items-center gap-1">
                    {movie.formats.map((fmt) => (
                      <span key={fmt} className="font-bold text-white bg-black/40 px-1.5 py-0.5 rounded">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                  <span className="text-gray-400">Languages:</span>{' '}
                  <strong className="text-white">{movie.languages.join(', ')}</strong>
                </div>

                <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
                  <span className="text-gray-400">Certificate:</span>{' '}
                  <strong className="text-[#f84464]">{movie.certificate}</strong>
                </div>
              </div>

              {/* Meta: Duration, Release Date, Genres */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {movie.runtimeFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {movie.releaseDate}
                </span>
                <span>•</span>
                <span>{movie.genres.join(', ')}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => setLocation(`/movie/${movie.id}/shows`)}
                  className="px-8 py-3.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white font-bold text-base shadow-cine-red transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  Book Tickets
                  <ArrowRight className="w-4 h-4" />
                </button>

                {movie.trailerEmbedId && (
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* About The Movie */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-black text-gray-900 mb-3 font-display">
            About the Movie
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {movie.synopsis}
          </p>
        </div>

        {/* Cast & Crew Horizontal Scroll */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <h2 className="text-xl font-black text-gray-900 mb-6 font-display">
            Cast & Crew
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {movie.cast.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#f84464] transition-colors mb-3 shadow">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{member.name}</h4>
                <p className="text-xs text-[#f84464] font-medium mt-0.5">{member.character}</p>
                <span className="text-[11px] text-gray-400 mt-0.5">{member.role}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-8 text-xs text-gray-600">
            <div>
              <span className="text-gray-400 block mb-0.5">Director</span>
              <strong className="text-gray-900 text-sm">{movie.director}</strong>
            </div>
            {movie.musicDirector && (
              <div>
                <span className="text-gray-400 block mb-0.5">Music Director</span>
                <strong className="text-gray-900 text-sm">{movie.musicDirector}</strong>
              </div>
            )}
            {movie.producers && (
              <div>
                <span className="text-gray-400 block mb-0.5">Producers</span>
                <strong className="text-gray-900 text-sm">{movie.producers}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Top User Reviews */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 font-display">
                Audience Reviews
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {movie.reviews.length} Verified Audience Reviews
              </p>
            </div>
            <button
              onClick={() => setIsReviewOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Write a Review
            </button>
          </div>

          {movie.reviews.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">
              Be the first to review this movie!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.reviews.map((rev) => {
                const currentLikes = likedReviews[rev.id] || rev.likes;
                return (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl bg-[#f8f9fc] border border-gray-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-[#f84464] font-bold text-xs flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-gray-900">{rev.userName}</h4>
                            <span className="text-[10px] text-gray-400">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-black">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{rev.rating}/10</span>
                        </div>
                      </div>

                      <h5 className="font-bold text-sm text-gray-900 mb-1">{rev.title}</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>

                      {rev.tags && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {rev.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[10px] font-semibold text-gray-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                      <button
                        onClick={() => handleLikeReview(rev.id, rev.likes)}
                        className="flex items-center gap-1.5 hover:text-[#f84464] transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{currentLikes} Helpful</span>
                      </button>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Ticket Buyer
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && movie.trailerEmbedId && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          title={movie.title}
          embedId={movie.trailerEmbedId}
        />
      )}

      {/* Review Modal */}
      {isReviewOpen && (
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          movieId={movie.id}
          movieTitle={movie.title}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </div>
  );
};
