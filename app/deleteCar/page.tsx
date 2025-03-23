'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/header';

type Car = {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  price: number;
  ownerName: string;
};

export default function DeleteCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<Car[]>('/api/cars/get');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        toast.error('Failed to load cars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSelectCar = (carId: number) => {
    setSelectedCarId(carId === selectedCarId ? null : carId);
  };

  const handleDelete = async () => {
    if (!selectedCarId) {
      toast.error('Please select a car to delete');
      return;
    }

    try {
      const response = await axios.delete(`/api/cars/delete/${selectedCarId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        const newCarsResponse = await axios.get<Car[]>('/api/cars/get');
        setCars(newCarsResponse.data);
        setSelectedCarId(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to delete car');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <><Header />
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Delete Cars</h1>

      {isLoading ? (
        <p className="text-lg text-gray-600">Loading cars...</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Select</th>
                <th className="p-2 border text-left">Brand</th>
                <th className="p-2 border text-left">Model</th>
                <th className="p-2 border text-left">Fuel Type</th>
                <th className="p-2 border text-left">Price</th>
                <th className="p-2 border text-left">Owner</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr
                  key={car.id}
                  className={`hover:bg-gray-50 ${selectedCarId === car.id ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectCar(car.id)}
                >
                  <td className="p-2 border">
                    <input
                      type="radio"
                      name="selectedCar"
                      checked={selectedCarId === car.id}
                      onChange={() => handleSelectCar(car.id)} />
                  </td>
                  <td className="p-2 border">{car.brand}</td>
                  <td className="p-2 border">{car.model}</td>
                  <td className="p-2 border">{car.fuelType}</td>
                  <td className="p-2 border">${car.price.toFixed(2)}/day</td>
                  <td className="p-2 border">{car.ownerName}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={!selectedCarId}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              Delete Selected Car
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Return to Dashboard
            </Link>
          </div>
        </>
      )}
    </main></>
  );
}