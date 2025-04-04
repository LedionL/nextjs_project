'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import Header from '../components/header';
import { ResponseState } from '../types';

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
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-amber-500 pb-2">
          Add New Vehicle
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
              placeholder="The Vehicle's Brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Model
            </label>
            <input
              type="text"
              name="model"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
              placeholder="The Vehicle's Models"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fuel Type
            </label>
            <select
              name="fuelType"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white appearance-none"
            >
              <option value="" disabled className="text-gray-500">Select Fuel Type</option>
              <option value="Gasoline" className="bg-gray-800">Gasoline</option>
              <option value="Diesel" className="bg-gray-800">Diesel</option>
              <option value="Petrol" className="bg-gray-800">Petrol</option> 
              <option value="Electric" className="bg-gray-800">Electric</option>
              <option value="Hybrid" className="bg-gray-800">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price per Day (USD)
            </label>
            <input
              type="number"
              name="price"
              required
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
              placeholder="Daily Price to Rent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Owner Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-500 transition-all"
              placeholder="owner@luxurycars.com"
            />
          </div>

          {state?.message && (
            <div className={`p-4 rounded-lg border ${
              state.success 
                ? 'bg-green-900/30 border-green-800 text-green-400' 
                : 'bg-red-900/30 border-red-800 text-red-400'
            }`}>
              {state.message}
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
            >
              {isPending ? 'Adding Luxury Vehicle...' : 'Add to Fleet'}
            </button>

            <Link
              href="/dashboard"
              className="border border-amber-500 text-amber-500 hover:bg-amber-500/10 px-6 py-3 rounded-lg font-medium transition-colors text-center flex-1"
            >
              Back to Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div></>
  );
}