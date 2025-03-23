// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/header";

type Car = {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  price: number;
  ownerName: string;
};

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRent = (carId: number) => {
    console.log(`Rent car with ID: ${carId}`);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<Car[]>("/api/cars/get");
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-8 py-8">
        {isLoading ? (
          <p className="text-lg text-gray-300">Loading vehicles..</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {cars.map((car) => (
              <div 
                key={car.id} 
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-between h-56"
              >
                <div>
                  <h2 className="font-bold text-lg text-white mb-2">
                    {car.brand} {car.model}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400">
                      <span className="text-amber-500">Fuel:</span> {car.fuelType}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-amber-500">Price:</span> ${car.price.toFixed(2)}/day
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-amber-500">Owner:</span> {car.ownerName}
                    </p>
                  </div>
                </div>
                <div className="mt-auto text-right">
                  <button
                    onClick={() => handleRent(car.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg text-sm transition-colors"
                  >
                    Reserve Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}