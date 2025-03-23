'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import Header from '../components/header';


type ResponseState = {
  success: boolean;
  message: string;
} | null;

export default function AddCarPage() {
  const [state, setState] = useState<ResponseState>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const response = await axios.post('/api/cars/add', {
        brand: formData.get('brand'),
        model: formData.get('model'),
        fuelType: formData.get('fuelType'),
        price: Number(formData.get('price')),
        email: formData.get('email')
      });

      setState(response.data);
    } 
    catch (error) {
      if (axios.isAxiosError(error)) {
        setState({
          success: false,
          message: error.response?.data?.message || 'Failed to add car',
        });
      } else {
        setState({
          success: false,
          message: 'An unexpected error occurred',
        });
      }
    }
  };

  return (
    <><Header />
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Car</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            required
            className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-2">Model</label>
          <input
            type="text"
            name="model"
            required
            className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-2">Fuel Type</label>
          <select
            name="fuelType"
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Fuel Type</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Petrol">Petrol</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Price per Day</label>
          <input
            type="number"
            name="price"
            step="0.01"
            required
            className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-2">Owner Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 border rounded" />
        </div>

        {state?.message && (
          <p className={`p-2 rounded ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {state.message}
          </p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isPending ? 'Adding...' : 'Add Car'}
          </button>

          <Link
            href="/dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>
      </form>
    </div></>
  );
}