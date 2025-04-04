'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/header';
import { Car } from '../types';

export default function DeleteCars() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCars, setTotalCars] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const pageSize = 10;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const totalPages = Math.ceil(totalCars / pageSize);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery !== (searchParams.get('q') || '')) {
      const params = new URLSearchParams();
      params.set('page', '1');
      if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
      router.replace(`/deleteCar?${params.toString()}`);
    }
  }, [debouncedSearchQuery, searchParams]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `/api/cars/search?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        setCars(response.data.cars);
        setTotalCars(response.data.total);
      } catch (error) {
        console.error('Error fetching cars:', error);
        toast.error('Failed to load cars');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [page, debouncedSearchQuery]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    window.location.href = `/deleteCar?${params.toString()}`;
  };

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
        if (cars.length === 1 && page > 1) {
          handlePageChange(page - 1);
        } else {
          window.location.reload();
        }
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
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-6 py-12 max-w-6xl pt-24">
          <h1 className="text-3xl font-bold text-white mb-4 border-b border-amber-500 pb-2">
            Manage Vehicle Removal
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-lg text-gray-300">Loading vehicles...</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-700 mb-4">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-amber-500 border-b border-gray-700">
                        Select
                      </th>
                      {['Brand', 'Model', 'Fuel Type', 'Price', 'Owner'].map((header) => (
                        <th
                          key={header}
                          className="p-4 text-left text-sm font-medium text-amber-500 border-b border-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr
                        key={car.id}
                        className={`hover:bg-gray-800/50 transition-colors border-b border-gray-700 last:border-0 cursor-pointer ${
                          selectedCarId === car.id ? 'bg-amber-900/20' : ''
                        }`}
                        onClick={() => handleSelectCar(car.id)}
                      >
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="relative">
                              <div className={`w-5 h-5 rounded-full border-2 ${
                                selectedCarId === car.id 
                                  ? 'border-amber-500 bg-amber-500/20' 
                                  : 'border-gray-500'
                              }`}>
                                {selectedCarId === car.id && (
                                  <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-amber-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{car.brand}</td>
                        <td className="p-4 text-gray-300">{car.model}</td>
                        <td className="p-4 text-gray-300">{car.fuelType}</td>
                        <td className="p-4 text-amber-400">
                          ${car.price.toFixed(2)}/day
                        </td>
                        <td className="p-4 text-blue-400">{car.ownerName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6">
                <div className="flex justify-center items-center">
                  <div className="ml-3 flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-amber-600 transition-colors text-white"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-300 mx-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:hover:bg-amber-600 transition-colors text-white"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDelete}
                  disabled={!selectedCarId}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Removal
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}