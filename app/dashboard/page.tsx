'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/header";
import CarCard from "../components/carCard";
import { Car } from "../types";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const pageSize = 16;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const totalPages = Math.ceil(totalCars / pageSize);

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard?page=${Math.max(1, newPage)}`);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/cars/get?page=${page}&pageSize=${pageSize}`);
        setCars(response.data.cars);
        setTotalCars(response.data.total);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <Header />
      <main className="container mx-auto px-8 pb-12 pt-9">
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