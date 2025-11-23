"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { notifyError } from "@/app/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));

      router.push("/recipes");
    } catch {
      notifyError("Login Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md space-y-5"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center text-green-600">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded w-full focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded w-full focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition">
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          No account?{" "}
          <a className="text-blue-600 hover:underline" href="/auth/register">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
