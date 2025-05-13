"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/component/ui/ProductCard";
import Update_Product from "@/component/modalsandpopups/UpdateProduct";
import AddProduct from "@/component/modalsandpopups/AddProduct";
import { getProducts } from '@/apiService/productServices'
import { ProductInterface } from "@/types/productTypes";


const SampleProducts: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductInterface | null>(null);
  const [addProduct, setAddProduct] = useState(false);
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const getProduct = async () => {
    const response = await getProducts();

    if (response.success) {
      setProducts(response.product);
      console.log(response.product)
    } else {
      console.log("No Products");
      setProducts([]);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleUpdate = (product: ProductInterface) => {
    setSelectedProduct(product);
  };

  const handleCloseUpdate = () => {
    setSelectedProduct(null);
  };

  const handleCloseAdd = () => {
    setAddProduct(false);
    getProduct(); // Refresh product list after adding
  };

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-3 ml-4 mr-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>
          <p className="text-base text-gray-600 mt-1">
            Here's the List of your products.
          </p>
        </div>

        <button
          className="px-4 py-2 bg-blue-200 text-blue-500 rounded-full shadow-md cursor-pointer ml-auto"
          onClick={() => setAddProduct(true)}
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} {...product} onUpdate={() => handleUpdate(product)}  />
          ))
        ) : (
          <p className="text-gray-500">No products available.</p>
        )}
      </div>

      {selectedProduct && <Update_Product product={selectedProduct} onClose={handleCloseUpdate} refetch={getProduct} />}
      {addProduct && <AddProduct onClose={handleCloseAdd} />}
    </div>
  );
};

export default SampleProducts;
