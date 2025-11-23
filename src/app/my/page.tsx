"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import { notifyError } from "../lib/toast";

export default function ProfilePage() {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    api("/recipes/mine")
      .then((data) => setRecipes(data || []))
      .catch(() => notifyError("Failed to load your recipes"));
  }, []);

  async function deleteRecipe(id: number) {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await api(`/recipes/${id}`, { method: "DELETE" });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch {
      notifyError("Failed to delete");
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
        My Recipes
      </h1>

      {recipes.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 sm:p-8 text-center text-gray-600">
          You don’t have any recipes yet.
          <Link
            href="/recipes/create"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg block max-w-xs mx-auto hover:bg-green-700 transition"
          >
            + Create your first recipe
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {recipes.map((r) => (
          <div
            key={r.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            {r.images?.[0] ? (
              <img
                src={r.images[0]}
                className="w-full h-32 sm:h-40 object-cover"
              />
            ) : (
              <div className="w-full h-32 sm:h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4">
              <h2 className="text-lg sm:text-xl font-bold mb-1">{r.title}</h2>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {r.description}
              </p>

              <div className="flex justify-between text-sm sm:text-base">
                <Link
                  href={`/recipes/${r.id}`}
                  className="text-green-600 font-semibold hover:underline"
                >
                  View
                </Link>

                <button
                  onClick={() => deleteRecipe(r.id)}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
