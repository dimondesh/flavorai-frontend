"use client";

import { api } from "../../lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StarRating from "@/components/StarRating";
import { notifyError } from "@/app/lib/toast";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    api(`/recipes/${id}`)
      .then(setRecipe)
      .catch(() => notifyError("Failed to load recipe"));
  }, [id]);

  if (!recipe) return <p className="p-6">Loading...</p>;

  const images = recipe.images || [];

  const next = () => setImageIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setImageIndex((i) => (i - 1 + images.length) % images.length);

  const avgRating =
    recipe.ratings.length > 0
      ? recipe.ratings.reduce(
          (acc: number, r: { value: number }) => acc + r.value,
          0
        ) / recipe.ratings.length
      : 0;

  async function rate(value: number) {
    try {
      await api(`/ratings/${id}`, {
        method: "POST",
        body: JSON.stringify({ value }),
      });
      setRecipe(await api(`/recipes/${id}`));
    } catch {
      notifyError("Failed to rate");
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-[#f7f7f7] shadow rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-64 sm:h-[420px] bg-black flex items-center justify-center">
          {images.length > 0 && (
            <img
              src={images[imageIndex]}
              className="w-full h-full object-cover"
            />
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-full shadow"
              >
                ◀
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-full shadow"
              >
                ▶
              </button>
            </>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {recipe.title}
          </h1>

          <p className="text-gray-700 text-base sm:text-lg mb-6">
            {recipe.description}
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Ingredients</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {recipe.ingredients}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-1">Instructions</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {recipe.instructions}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <StarRating value={avgRating} onRate={rate} size={28} />
          </div>
        </div>
      </div>
    </main>
  );
}
