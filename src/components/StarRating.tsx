"use client";

import { Star } from "lucide-react";

interface Props {
  value: number;
  onRate?: (v: number) => void;
  size?: number;
}

export default function StarRating({ value, onRate, size = 28 }: Props) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rounded >= n;
        const half = !filled && rounded + 0.5 === n;

        return (
          <button
            key={n}
            onClick={() => onRate && onRate(n)}
            disabled={!onRate}
            className="disabled:cursor-default"
          >
            <Star
              size={size}
              className={
                filled
                  ? "text-yellow-500 fill-yellow-500"
                  : half
                  ? "text-yellow-500 fill-yellow-300"
                  : "text-gray-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
