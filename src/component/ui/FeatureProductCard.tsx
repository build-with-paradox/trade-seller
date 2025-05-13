"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { ProductInterface } from "@/types/productTypes";

interface FeaturedProductCardProps {
  product: ProductInterface,
  onRemove: (_id: string) => void; // Callback function to handle update
}

const FeaturedProductCard: React.FC<FeaturedProductCardProps> = ({
  product,
  onRemove
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-80">
      {/* Product Image */}
      <div className="relative w-full h-48 ml-10">
        <Image
          src={product.productImage.url || '/default-image.jpg'}
          alt={product.productName}
          width={180}
          height={180}
          className="rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
        {product.productDescription && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.productDescription}</p>
        )}

        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-blue-500">₹{product.price.toLocaleString()}</span>
          <div className="flex items-center text-yellow-500">
            <FaStar /> <span className="ml-1 text-gray-700">{product.rating}</span>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={() => onRemove(product._id)}
          className="mt-4 w-full bg-blue-200 text-blue-500 py-2 rounded-full cursor-pointer hover:bg-blue-300 transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductCard;
