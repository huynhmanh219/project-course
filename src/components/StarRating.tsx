import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  totalRatings?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showCount = false,
  totalRatings = 0
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            disabled={readonly}
            className={`
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              transition-transform duration-150
              ${!readonly ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded' : ''}
            `}
          >
            <Star
              className={`
                ${sizeClasses[size]}
                ${star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-200 text-gray-200'
                }
                transition-colors duration-150
              `}
            />
          </button>
        ))}
      </div>
      
      {showCount && (
        <div className="flex items-center gap-1 ml-2 text-sm text-gray-600">
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span>({totalRatings} đánh giá)</span>
        </div>
      )}
    </div>
  );
};

export default StarRating; 