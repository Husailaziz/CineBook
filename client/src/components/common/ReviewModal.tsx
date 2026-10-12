import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { cinebookApi } from '../../api/cinebookApi';
import { Review } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
  onReviewAdded: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  onReviewAdded
}) => {
  const { user } = useUser();
  const [rating, setRating] = useState(10);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a brief comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newReview = await cinebookApi.addReview(movieId, {
        userName: user.name || 'Movie Lover',
        rating,
        title: title.trim() || `${rating}/10 Movie Experience`,
        comment: comment.trim()
      });
      onReviewAdded(newReview);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1e202f] border border-white/10 text-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">Rate & Review</h3>
            <p className="text-xs text-gray-400 truncate max-w-xs">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Interactive Star Rating */}
          <div className="flex flex-col items-center justify-center py-2 bg-[#25273a] rounded-xl border border-white/5">
            <span className="text-xs font-semibold text-gray-400 mb-2">How was your movie experience?</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRating(num)}
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= num
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-amber-400 mt-2">
              {hoverRating || rating} / 10 Stars
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Headline / Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Unbelievable acting & edge of the seat horror!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#282a3e] border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#f84464]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Your Review / Thoughts *
            </label>
            <textarea
              rows={4}
              placeholder="Share what you liked about the plot, songs, acting or theatre experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#282a3e] border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#f84464]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#f84464] hover:bg-[#e03657] text-white text-xs font-bold shadow-cine-red transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
