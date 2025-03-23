'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from 'axios';
import { toast } from "react-toastify";
import Header from "../components/header";

type Car = {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  price: number;
  ownerName: string;
  ownerId?: number;
};

type User = {
  id: number;
  name: string;
};

export default function EditCars() {
  const router = useRouter();
  const [originalCars, setOriginalCars] = useState<Car[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<{ id: number; field: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [carsResponse, usersResponse] = await Promise.all([
          axios.get<Car[]>('/api/cars/get'),
          axios.get<User[]>('/api/users/get')
        ]);
        
        setOriginalCars(carsResponse.data);
        setCars(carsResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

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
        const newCarsResponse = await axios.get<Car[]>('/api/cars/get');
        setOriginalCars(newCarsResponse.data);
        setCars(newCarsResponse.data);
        toast.success(response.data.message);
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
    <><Header />
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Cars</h1>

      {isLoading ? (
        <p className="text-lg text-gray-600">Loading cars...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">ID</th>
                  <th className="p-2 border text-left">Brand</th>
                  <th className="p-2 border text-left">Model</th>
                  <th className="p-2 border text-left">Fuel Type</th>
                  <th className="p-2 border text-left">Price</th>
                  <th className="p-2 border text-left">Owner</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{car.id}</td>
                    {['brand', 'model', 'fuelType', 'price', 'ownerName'].map(field => (
                      <td
                        key={field}
                        className="p-2 border cursor-pointer"
                        onClick={() => handleEdit(car.id, field)}
                      >
                        {editing?.id === car.id && editing.field === field ? (
                          field === 'ownerName' ? (
                            <select
                              value={car.ownerName}
                              onChange={e => handleChange(car.id, field, e.target.value)}
                              className="w-full p-1"
                              autoFocus
                            >
                              {users.map(user => (
                                <option key={user.id} value={user.name}>
                                  {user.name}
                                </option>
                              ))}
                            </select>
                          ) : field === 'fuelType' ? (
                            <select
                              value={car[field]}
                              onChange={e => handleChange(car.id, field, e.target.value)}
                              className="w-full p-1"
                              autoFocus
                            >
                              <option value="Gasoline">Gasoline</option>
                              <option value="Diesel">Diesel</option>
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
                              className="w-full p-1"
                              autoFocus />
                          )
                        ) : (
                          field === 'price' ? `$${car.price.toFixed(2)}` : car[field as keyof Car]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
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