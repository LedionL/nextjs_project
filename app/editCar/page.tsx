'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios, { AxiosError } from 'axios';
import { toast } from "react-toastify";
import Header from "../components/header";
import { Car, User } from "../types";

export default function EditCars() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [originalCars, setOriginalCars] = useState<Car[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ id: number; field: string } | null>(null);
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
      router.replace(`/editCar?${params.toString()}`);
    }
  }, [debouncedSearchQuery, searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [carsResponse, usersResponse] = await Promise.all([
          axios.get(`/api/cars/search?page=${page}&pageSize=${pageSize}&q=${encodeURIComponent(debouncedSearchQuery)}`),
          axios.get<User[]>('/api/users/get')
        ]);
        
        setOriginalCars(carsResponse.data.cars);
        setCars(carsResponse.data.cars);
        setTotalCars(carsResponse.data.total);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [page, debouncedSearchQuery]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set('page', newPage.toString());
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    window.location.href = `/editCar?${params.toString()}`;
  };

  const handleEdit = (id: number, field: string) => setEditing({ id, field });

  const handleChange = (id: number, field: string, value: string | number) => {
    setCars(prev => prev.map(car => 
      car.id === id ? { ...car, [field]: value } : car
    ));
  };

  const handleSubmit = async () => {
    try {
      const changes = cars.reduce((acc, car) => {
        const originalCar = originalCars.find(oc => oc.id === car.id);
        if (!originalCar) return acc;

        const carChanges = Object.entries(car).reduce((obj, [key, val]) => {
          if (val !== originalCar[key as keyof Car]) {
            obj[key] = val;
          }
          return obj;
        }, {} as Record<string, any>);

        if (Object.keys(carChanges).length > 0) {
          acc[car.id] = carChanges;
        }
        return acc;
      }, {} as Record<number, Partial<Car>>);

      const changedCarIds = Object.keys(changes);
      
      if (changedCarIds.length === 0) {
        toast.error("No changes to save");
        return;
      }

      if (changedCarIds.length > 1) {
        toast.error("Please update one car at a time");
        window.location.reload();
        return;
      }

      const carId = parseInt(changedCarIds[0]);
      const carChanges = changes[carId];

      if (carChanges.ownerName) {
        const user = users.find(u => u.name === carChanges.ownerName);
        if (user) {
          carChanges.ownerId = user.id;
          delete carChanges.ownerName;
        } else {
          toast.error(`User ${carChanges.ownerName} not found`);
          return;
        }
      }

      const response = await axios.put(`/api/cars/edit/${carId}`, carChanges);

      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to save changes');
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
            Edit Vehicles
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <div className="w-full max-w-md">
              <input
                type="text"
                placeholder="Search Table..."
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
              <div className="overflow-x-auto rounded-xl border border-gray-700 mb-6">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-800">
                    <tr>
                      {['ID', 'Brand', 'Model', 'Fuel Type', 'Price', 'Owner'].map((header) => (
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
                    {cars.map(car => (
                      <tr 
                        key={car.id} 
                        className="hover:bg-gray-800/50 transition-colors border-b border-gray-700 last:border-0"
                      >
                        <td className="p-4 text-gray-300 font-mono">{car.id}</td>
                        {['brand', 'model', 'fuelType', 'price', 'ownerName'].map(field => (
                          <td
                            key={field}
                            className="p-4 text-gray-300"
                            onClick={() => handleEdit(car.id, field)}
                          >
                            {editing?.id === car.id && editing.field === field ? (
                              field === 'ownerName' ? (
                                <select
                                  value={car.ownerName}
                                  onChange={e => handleChange(car.id, field, e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
                                  autoFocus
                                >
                                  {users.map(user => (
                                    <option 
                                      key={user.id} 
                                      value={user.name}
                                      className="bg-gray-800"
                                    >
                                      {user.name}
                                    </option>
                                  ))}
                                </select>
                              ) : field === 'fuelType' ? (
                                <select
                                  value={car[field]}
                                  onChange={e => handleChange(car.id, field, e.target.value)}
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
                                  autoFocus
                                >
                                  <option value="Gasoline">Gasoline</option>
                                  <option value="Diesel">Diesel</option>
                                  <option value="Petrol">Petrol</option>
                                  <option value="Electric">Electric</option>
                                  <option value="Hybrid">Hybrid</option>
                                </select>
                              ) : (
                                <input
                                  type={field === 'price' ? 'number' : 'text'}
                                  value={car[field as keyof Car]}
                                  onChange={e => handleChange(
                                    car.id,
                                    field,
                                    field === 'price' ? parseFloat(e.target.value) : e.target.value
                                  )}
                                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 text-white"
                                  autoFocus
                                />
                              )
                            ) : (
                              field === 'price' ? (
                                <span className="text-amber-400">
                                  ${car.price.toFixed(2)}/day
                                </span>
                              ) : (
                                <span className={field === 'ownerName' ? 'text-blue-400' : ''}>
                                  {car[field as keyof Car]}
                                </span>
                              )
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {cars.length > 0 && (
                  <div className="bg-gray-800 p-4 border-t border-gray-700">
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
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}