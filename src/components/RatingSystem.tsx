
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface RatingSystemProps {
  gameId: string;
  onRatingSubmit?: (rating: number | string) => void;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ gameId, onRatingSubmit }) => {
  const [starRating, setStarRating] = useState(0);
  const [thumbsRating, setThumbsRating] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (rating: number) => {
    setStarRating(rating);
    onRatingSubmit?.(rating);
    toast({
      title: "Thank you for your rating!",
      description: `You rated this ${rating} star${rating !== 1 ? 's' : ''}`,
    });
  };

  const handleThumbsClick = (type: 'like' | 'dislike' | 'love') => {
    setThumbsRating(type);
    onRatingSubmit?.(type);
    toast({
      title: "Thank you for your feedback!",
      description: `We appreciate your ${type === 'love' ? 'love' : type} feedback`,
    });
  };

  if (!showRating) {
    return (
      <Button
        onClick={() => setShowRating(true)}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        Rate This Game
      </Button>
    );
  }

  return (
    <Card className="mt-4 bg-white/5 backdrop-blur-xl border border-white/10">
      <CardContent className="p-4">
        <h4 className="text-white font-semibold mb-3">Rate Your Experience</h4>
        
        {/* Star Rating */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">Star Rating:</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="transition-colors"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= starRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Thumbs Rating */}
        <div>
          <p className="text-gray-300 text-sm mb-2">Quick Feedback:</p>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleThumbsClick('like')}
              variant={thumbsRating === 'like' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              I like this
            </Button>
            <Button
              onClick={() => handleThumbsClick('dislike')}
              variant={thumbsRating === 'dislike' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              I don't like this
            </Button>
            <Button
              onClick={() => handleThumbsClick('love')}
              variant={thumbsRating === 'love' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <ThumbsUp className="h-4 w-4" />
              I love this
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingSystem;
