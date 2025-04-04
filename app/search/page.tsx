'use client';

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/header";
import CarCard from "../components/carCard";
import { Car } from "../types";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const query = searchParams.get("q") || "";
  const pageSize = 16;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const totalPages = Math.ceil(totalCars / pageSize);

  const handlePageChange = (newPage: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${Math.max(1, newPage)}`);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await axios.get(
          `/api/cars/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
        );
        setCars(response.data.cars);
        setTotalCars(response.data.total);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 500) {
          setCars([]);
          setTotalCars(0);
          setErrorMessage("No results found");
        } else {
          console.error("Error fetching search results:", error);
          setErrorMessage("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <Header />
      <main className="container mx-auto px-8 pb-12 pt-9">
        {!isLoading && (
          <h1 className="text-2xl text-white mb-6">
            {cars.length > 0
              ? `Results for cars containing "${query}"`
              : errorMessage || "No results found"}
          </h1>
        )}
        {isLoading ? (
          <p className="text-lg text-gray-300">Loading vehicles...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-10">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {cars.length > 0 && (
              <div className="flex justify-center items-center gap-1 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-300 min-w-[120px] text-center">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
