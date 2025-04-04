"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-sm border-b border-gray-700 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex space-x-8 items-center">
          <Link
            href="/dashboard"
            className="text-amber-500 font-bold text-xl hover:text-amber-400 transition-colors"
          >
            Home
          </Link>
          <div className="flex space-x-6">
            <Link
              href="/addCar"
              className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-light"
            >
              Add
            </Link>
            <Link
              href="/editCar"
              className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-light"
            >
              Edit
            </Link>
            <Link
              href="/deleteCar"
              className="text-gray-300 hover:text-amber-500 transition-colors text-sm font-light"
            >
              Remove
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-50 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 placeholder-gray-500 
              focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors border border-gray-600 text-sm"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
}
