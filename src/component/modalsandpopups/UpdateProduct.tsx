"use client";

import { updateProduct } from "@/apiService/productServices";
import { ProductInterface } from "@/types/productTypes";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";


interface UpdateProductProps {
  product: ProductInterface;
  onClose: () => void;
  refetch: () => void
}

const Update_Product: React.FC<UpdateProductProps> = ({ product, onClose, refetch }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (product) {
      const imageUrl =
        typeof product.productImage === "string"
          ? product.productImage
          : product.productImage.url;

      setImagePreview(imageUrl);
      setImageFile(null);
      setFileName("");
      setName(product.productName);
      setDescription(product?.productDescription ? product.productDescription : "");
      setPrice(product.price.toString());
      setStock(product.stock.toString());
    }
  }, [product]);

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
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || isNaN(stockNum)) {
      alert("Please enter valid numeric values for price and stock.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", product._id)
    formData.append("productName", name);
    formData.append("productDescription", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (imageFile) {
      formData.append("productImage", imageFile);
    }

    try {
        const response = await updateProduct(formData); 

        if (response?.success) {
            toast.success(response.message);
            setImageFile(null);
            setImagePreview("");
            setFileName("");
            setName("");
            setDescription("");
            setPrice("");
            setStock("");

            refetch()
            onClose();
        } else {
            toast.error(response?.message.error || "Failed to update product");
        }
    } catch (error) {
        toast.error("Something went wrong. Try again!");
        console.error("Upload error:", error);
    }

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50 ml-[16rem]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-[600px] md:w-[700px] lg:w-[800px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-blue-500 cursor-pointer"
        >
          <AiOutlineClose size={24} />
        </button>

        <h1 className="text-3xl font-semibold text-gray-800 text-center">Update Product</h1>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-700 block mb-2">Product Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={name}
                onChange={(e) => handleInputChange(e, setName)}
              />
            </div>
            <div>
              <label className="text-gray-700 block mb-2">Description</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={description}
                onChange={(e) => handleInputChange(e, setDescription)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 block mb-2">Price</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={price}
                  onChange={(e) => handleInputChange(e, setPrice)}
                />
              </div>
              <div>
                <label className="text-gray-700 block mb-2">stock</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={stock}
                  onChange={(e) => handleInputChange(e, setStock)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-blue-200 text-blue-500 rounded-full cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update_Product;
