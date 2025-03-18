"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Car = {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  price: number;
  ownerName: string;
};

export default function Home() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
  };

  const handleRent = (carId: number) => {
    console.log(`Rent car with ID: ${carId}`);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch cars');
        }

        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1>Landing</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>

      <Link
            href="/add-car"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            add a new car
          </Link>
      
      <div className="grid grid-cols-1 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 rounded">
            <h2 className="font-bold text-lg">{car.brand} {car.model}</h2>
            <p>Fuel Type: {car.fuelType}</p>
            <p>Price: ${car.price.toFixed(2)}/day</p>
            <p>Owner: {car.ownerName}</p>
            <button
              onClick={() => handleRent(car.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
            >
              Rent now
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}