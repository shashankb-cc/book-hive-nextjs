// components/dashboard/FavoriteButton.tsx
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggleFavorite,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggleFavorite();
    setTimeout(() => setIsAnimating(false), 1000); // Animation duration
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="relative"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`w-5 h-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
      />
      {isAnimating && !isFavorite && (
        <div className="absolute -top-1 -right-1 pointer-events-none">
          <Heart className="w-3 h-3 text-red-500 animate-heart-pop" />
        </div>
      )}
    </Button>
  );
};
