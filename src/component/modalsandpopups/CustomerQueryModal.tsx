"use client";

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface CustomerQueryInterface {
  id: number;
  name: string;
  message: string;
  email: string;
  status: string;
  date: string;
  product_details: {
    productimage: string;
    productname: string;
    price: string;
    order_date: string;
  };
}

interface CustomerQueryProps {
  query: CustomerQueryInterface;
  onClose: () => void;
}

const CustomerQuery: React.FC<CustomerQueryProps> = ({ query, onClose }) => {
  const [reply, setReply] = useState("");

  const handleReply = () => {
    alert(`Reply to ${query.name}:\n\n${reply}`);
    setReply("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-md z-50 ml-[16rem]">
      <div className="bg-white shadow-2xl rounded-full w-[90%] md:w-[80%] h-[90vh] relative flex">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 cursor-pointer transition"
        >
          <AiOutlineClose size={24} />
        </button>

        {/* Left Side - Product Info */}
        <div className="w-full md:w-1/2 p-6 border-r border-gray-200 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
          <img
            src={query.product_details.productimage}
            alt={query.product_details.productname}
            className="w-48 h-48 object-cover mb-4 rounded-xl shadow-md"
          />
          <h2 className="text-2xl font-bold text-gray-900">{query.product_details.productname}</h2>
          <p className="text-gray-700 mt-1">Price: {query.product_details.price}</p>
          <p className="text-gray-600 text-sm mt-1">Ordered on: {query.product_details.order_date}</p>
        </div>

        {/* Right Side - Customer Query and Reply */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-full bg-white flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Query</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <p className="text-gray-700 mb-1">
              <span className="font-medium">From:</span> {query.name} ({query.email})
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Message:</span> {query.message}
            </p>
          </div>

          <label htmlFor="reply" className="text-sm font-medium text-gray-800 mb-2">
            Your Reply
          </label>
          <textarea
            id="reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="Type your response..."
          ></textarea>

          <button
            onClick={handleReply}
            className="mt-4 bg-blue-200 text-blue-600 px-5 py-2 rounded-full self-end cursor-pointer"
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerQuery;
