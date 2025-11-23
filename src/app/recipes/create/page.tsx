"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notifyError } from "@/app/lib/toast";

export default function CreateRecipePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);

  function handleFiles(selected: File[]) {
    const valid = selected.filter((f) => f.type.startsWith("image/"));

    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
  }

  function removeImage(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const form = new FormData();
    form.append("title", title);
    form.append("ingredients", ingredients);
    form.append("instructions", instructions);
    form.append("description", description);

    files.forEach((file) => {
      form.append("images", file);
    });

    const res = await fetch("http://localhost:5000/recipes", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")!,
      },
      body: form,
    });

    if (!res.ok) {
      notifyError("Failed to create recipe");
      return;
    }

    router.push("/recipes");
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Create Recipe</h1>

      <form
        className="bg-white shadow-lg rounded-xl p-6 space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block mb-1 text-gray-700 font-bold">
            Recipe Title
          </label>
          <input
            className="bg-[#f7f7f7] rounded-lg p-3 w-full focus:ring-2 focus:ring-green-500 duration-300 outline-none"
            placeholder="Best Homemade Pizza"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-gray-700">
            Short Description
          </label>
          <textarea
            className="bg-[#f7f7f7] rounded-lg p-3 w-full h-20 focus:ring-2 focus:ring-green-500 duration-300 outline-none"
            placeholder="A delicious homemade pizza with fresh ingredients."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-gray-700">
            Ingredients
          </label>
          <textarea
            className="bg-[#f7f7f7] rounded-lg p-3 w-full h-28 focus:ring-2 focus:ring-green-500 duration-300 outline-none"
            placeholder="Flour, Cheese, Tomato sauce, Olive oil"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-gray-700">
            Instructions
          </label>
          <textarea
            className="bg-[#f7f7f7] rounded-lg p-3 w-full h-40 focus:ring-2 focus:ring-green-500 duration-300 outline-none"
            placeholder="1. Mix ingredients... 2. Preheat oven... 3. Bake for 12 minutes..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-1 text-gray-700">
            Recipe Photos
          </label>

          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition 
              ${drag ? "border-green-600 bg-green-50" : "border-gray-300"}
            `}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDrag(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const dropped = Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith("image/")
              );
              handleFiles(dropped);
            }}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <p className="text-gray-600">
              <span className="text-green-600 font-semibold">
                Click to upload
              </span>{" "}
              or drag & drop
            </p>
            <p className="text-gray-400 text-sm">JPG, PNG — up to 10 images</p>
          </div>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          />

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    className="rounded-lg h-32 w-full object-cover border shadow-sm"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white w-7 h-7 rounded-full 
                    flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
          Save Recipe
        </button>
      </form>
    </main>
  );
}
