"use client";

import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

interface ProductCardProps {
  _id: string;
  productImage:{
    url: string
  };
  productName: string;
  productDescription?: string;
  price: number;
  rating: number;
  onUpdate: (id: string) => void; // Callback function to handle update
}

const ProductCard: React.FC<ProductCardProps> = ({ _id, productImage, productName, productDescription, price, rating, onUpdate }) => {

  const productimageUrl =
  typeof productImage === "string"
    ? productImage
    : productImage.url;
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-80">
      {/* Product Image */}
      <div className="relative w-full h-48 ml-10">
        <Image
          src={productimageUrl}
          alt={productName}
          width={180}
          height={180}
          className="rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{productName}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate overflow-hidden whitespace-nowrap text-ellipsis">
  {productDescription}
</p>


        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-blue-500">₹{price.toLocaleString()}</span>
          <div className="flex items-center text-yellow-500">
            <FaStar /> <span className="ml-1 text-gray-700">{rating || 0.0}</span>
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={() => onUpdate(_id)} // Calls the function with the product id
          className="mt-4 w-full bg-blue-200 text-blue-500 py-2 rounded-full cursor-pointer hover:bg-blue-300 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
