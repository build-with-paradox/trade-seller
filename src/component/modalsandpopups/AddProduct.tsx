"use client";

import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { uploadProduct } from "@/apiService/productServices";
import toast from "react-hot-toast";

interface AddProductProps {
    onClose: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onClose }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [stock, setstock] = useState<string>("");
    const [category, setCategory] = useState<string>("Clothing");

    const categories = [
        "Clothing",
        "Footwear",
        "Electronics",
        "Softwares and Games",
        "Books",
        "Accessories",
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setFileName(file.name);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(e.target.value);
    };

    const handleSaveChanges = async () => {
        if (!imageFile || !name || !description || !price || !stock || !category) {
            toast.error("Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("productImage", imageFile);
        formData.append("productName", name);
        formData.append("productDescription", description);
        formData.append("productCategory", category);
        formData.append("price", price);
        formData.append("stock", stock);

        try {
            const response = await uploadProduct(formData); // Ensure this endpoint accepts FormData

            if (response?.success) {
                toast.success(response.message);
                // Reset form
                setImageFile(null);
                setImagePreview("");
                setFileName("");
                setName("");
                setDescription("");
                setPrice("");
                setstock("");
                setCategory("Clothing");

                onClose();
            } else {
                toast.error(response?.error || "Failed to add product");
            }
        } catch (error) {
            toast.error("Something went wrong. Try again!");
            console.error("Upload error:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50 ml-[16rem]">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] transform transition-all ease-out duration-300 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                    <AiOutlineClose size={24} />
                </button>
                <h1 className="text-3xl font-semibold text-gray-800 text-center">Add New Product</h1>

                {/* Grid Layout */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Image Upload */}
                    <div className="flex flex-col items-center">
                        <label className="text-gray-700 block mb-2">Product Image</label>
                        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400">No Image</span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="fileUpload"
                            onChange={handleImageUpload}
                        />
                        <button
                            className="mt-3 px-6 py-2 bg-blue-200 text-blue-500 rounded-full"
                            onClick={() => document.getElementById("fileUpload")?.click()}
                        >
                            Upload Image
                        </button>
                        {fileName && <p className="mt-2 text-gray-500 text-sm">{fileName}</p>}
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-gray-700 block mb-2">Product Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                value={name}
                                placeholder="Product Name"
                                onChange={(e) => handleInputChange(e, setName)}
                            />
                        </div>
                        <div>
                            <label className="text-gray-700 block mb-2">Description</label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                value={description}
                                placeholder="Description of Product"
                                onChange={(e) => handleInputChange(e, setDescription)}
                            />
                        </div>
                        <div>
                            <label className="text-gray-700 block mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-700 block mb-2">Price</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    value={price}
                                    placeholder="500"
                                    onChange={(e) => handleInputChange(e, setPrice)}
                                />
                            </div>
                            <div>
                                <label className="text-gray-700 block mb-2">stock</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                    value={stock}
                                    placeholder="10"
                                    onChange={(e) => handleInputChange(e, setstock)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 rounded-full text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-6 py-2 bg-blue-200 text-blue-500 rounded-full"
                    >
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
