import { useState } from "react";
import { Button } from "../components/ui/button";

export function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Sign Up</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Sign Up
          </Button>
        </form>
        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
}
