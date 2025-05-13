"use client";

import React from "react";
import { CiFileOn } from "react-icons/ci";

// Define prop types
interface Product {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity_buyed: number;
}

interface Settlement {
  id: string;
  date: string;
  delivery_status: string;
  products: Product[];
  earnings: string;
}

interface RecentPayoutsProps {
  settlements: Settlement[];
}

const RecentPayouts: React.FC<RecentPayoutsProps> = ({ settlements }) => {
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-3">
      {/* Header */}
      <div className="flex items-center mb-4">
        <CiFileOn className="text-gray-600" size={20} />
        <h2 className="text-md font-semibold text-gray-800 ml-2">
          Recent Payouts
        </h2>
      </div>

      <div className="space-y-4">
        {settlements.map((settlement, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-gray-300 p-4 rounded-lg shadow-sm"
          >
            {/* Images */}
            <div className="flex -space-x-2">
              {settlement.products.map((product, i) => (
                <img
                  key={i}
                  src={product.productImage}
                  alt={product.productName}
                  className="w-10 h-10 rounded-full border border-white shadow-sm"
                  style={{ zIndex: settlement.products.length - i }}
                />
              ))}
            </div>

            {/* Order Details */}
            <div className="flex-1 text-gray-700 ml-4">
              <p className="font-medium text-sm">Order ID: {settlement.id}</p>
              <div className="flex text-xs text-gray-600 space-x-4">
                <p>{settlement.products.length} items</p>
                <p>Order Date: {new Date(settlement.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Earnings */}
            <p className="font-semibold text-gray-800 text-sm">
              {settlement.earnings}
            </p>

            {/* Settlement Status */}
            <div
              className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                settlement.delivery_status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : settlement.delivery_status === "Shipped"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {settlement.delivery_status === "Delivered" ? (
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-700 text-white mr-2 text-xs">
                  ✓
                </div>
              ) : null}
              {settlement.delivery_status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPayouts;
