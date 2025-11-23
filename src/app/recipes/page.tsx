"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Link from "next/link";
import { notifyError } from "../lib/toast";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    api("/recipes")
      .then((data) => setRecipes(data || []))
      .catch(() => notifyError("Failed to load recipes"));
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 bg-[#f7f7f7]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">All Recipes</h1>

        <Link
          href="/recipes/create"
          className="bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {recipes.map((r) => (
          <Link
            key={r.id}
            href={`/recipes/${r.id}`}
            className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            {r.images?.[0] && (
              <img
                src={r.images[0]}
                className="w-full h-40 sm:h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-xl font-semibold">{r.title}</h2>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {r.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
