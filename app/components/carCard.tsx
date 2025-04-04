"use client";

import { Car } from "../types";

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-between h-56">
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
                    className="bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg text-sm transition-colors"
                  >
                    Reserve Now
                  </button>
    </div>
    </div>
  );
}