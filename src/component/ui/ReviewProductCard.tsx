"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface ReviewProductCardProps {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  showReview: (id: string) => void; 
}

const ReviewProductCard: React.FC<ReviewProductCardProps> = ({ id, image, name, description, price, rating, showReview }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-80">
      {/* Product Image */}
      <div className="relative w-full h-38 ml-10">
        <Image
          src={image}
          alt={name}
          width={150}
          height={150}
          className="rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-blue-500">₹{price.toLocaleString()}</span>
          <div className="flex items-center text-yellow-500">
            <FaStar /> <span className="ml-1 text-gray-700">{rating}</span>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={() => showReview(id)} // Calls the function with the product id
          className="mt-4 w-full bg-blue-200 text-blue-500 py-2 rounded-full cursor-pointer hover:bg-blue-300 transition"
        >
          Check Reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewProductCard;
