"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Product {
    id: string;
    image: string;
    name: string;
    description: string;
    price: number;
    rating: number | 0;
    quantity: number;
    discount?: number | 0; 
}

interface UpdateProductProps {
    product: Product;
    onClose: () => void;
}

const Manage_Discount: React.FC<UpdateProductProps> = ({ product, onClose }) => {
    const [imagePreview, setImagePreview] = useState(product.image);
    const [discount, setDiscount] = useState((product.discount || 0).toString());

    useEffect(() => {
        if (product) {
            setImagePreview(product.image);
            setDiscount((product.discount || 0).toString());
        }
    }, [product]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(e.target.value);
    };

    const handleSaveChanges = () => {
        const discountNum = parseFloat(discount);

        if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
            alert("Please enter a valid discount between 0% and 100%.");
            return;
        }

        const updatedProduct: Product = {
            ...product,
            discount: discountNum,
        };

        console.log("Updated Product Data:", updatedProduct);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50 ml-[16rem]">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-blue-500"
                >
                    <AiOutlineClose size={24} />
                </button>

                <h1 className="text-3xl font-semibold text-gray-800 text-center">Manage Discount</h1>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Product Image */}
                    <div className="flex flex-col items-center justify-center">
                        <label className="text-gray-700 mb-2">Product Image</label>
                        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                            <img src={imagePreview} alt="Product" className="w-30 h-30 object-cover" />
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg"
                                value={product.name}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg"
                                value={product.description}
                                readOnly
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg"
                                    value={product.price}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg"
                                    value={product.quantity}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-700 mb-1">Discount (%)</label>
                            <input
                                type="number"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                value={discount}
                                onChange={(e) => handleInputChange(e, setDiscount)}
                                min={0}
                                max={100}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 rounded-full text-gray-700 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-6 py-2 bg-blue-200 text-blue-600 rounded-full cursor-pointer"
                    >
                        Save Discount
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Manage_Discount;
