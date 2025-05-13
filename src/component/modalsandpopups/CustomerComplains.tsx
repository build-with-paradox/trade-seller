"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

// Define product type
interface Product {
    id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    quantity: number;
    reason: string;
}

interface CustomerComplainProps {
    product: Product;
    onClose: () => void;
}

const CustomerComplain: React.FC<CustomerComplainProps> = ({ product, onClose }) => {
    const [imagePreview, setImagePreview] = useState(product.image);

    useEffect(() => {
        setImagePreview(product.image);
    }, [product]);

    const handleResolveComplaint = () => {
        console.log("Resolved Complaint:", product.reason);
        alert("Complaint marked as resolved.");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50 ml-[16rem]">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] transform transition-all ease-out duration-300 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                    <AiOutlineClose size={24} />
                </button>

                <h1 className="text-3xl font-semibold text-gray-800 text-center">Customer Complaint</h1>

                {/* Grid Layout */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Product Image */}
                    <div className="flex flex-col items-center">
                        <label className="text-gray-700 block mb-2">Product Image</label>
                        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-fit" />
                            ) : (
                                <span className="text-gray-400">No Image</span>
                            )}
                        </div>
                    </div>

                    {/* Right: Complaint Details */}
                    <div className="flex flex-col gap-4">
                        <p className="text-lg font-semibold text-gray-700">Product: {product.name}</p>
                        <p className="text-sm text-gray-600">Reason: <span className="font-medium text-red-500">{product.reason}</span></p>
                        <p className="text-sm text-gray-600">Description: {product.description}</p>
                        <p className="text-sm text-gray-600">Price: ₹{product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-6 py-2 cursor-pointer bg-gray-300 rounded-full text-gray-700">
                        Cancel
                    </button>
                    <button onClick={handleResolveComplaint} className="px-6 py-2 bg-blue-200 text-blue-500 cursor-pointer rounded-full">
                        Mark Resolved
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerComplain;
