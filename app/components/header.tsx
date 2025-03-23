// components/Header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
  };

  return (
    <header className="bg-black border-b border-gray-700">
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
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors border border-gray-600 text-sm"
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}