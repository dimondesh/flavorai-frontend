export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center py-20 text-center bg-[#F7F7F7]">
      <h1 className="text-5xl font-extrabold text-green-600 mb-4">FlavorAI</h1>
      <p className="text-gray-600 text-lg max-w-xl">
        Your personal AI-powered recipe discovery assistant.
      </p>
      <a
        href="/recipes"
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition"
      >
        Explore Recipes
      </a>
    </main>
  );
}
