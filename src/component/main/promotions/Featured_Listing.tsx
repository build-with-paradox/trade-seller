"use client";

import React, { useEffect, useState } from "react";
import FeatureProduct from "@/component/modalsandpopups/FeatureProduct";
import FeaturedProductCard from "@/component/ui/FeatureProductCard";
import { ProductInterface } from "@/types/productTypes";
import toast from "react-hot-toast";
import { featureProductsService, getFeaturedProductsService } from "@/apiService/productServices";
import { FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { MdOutlineInventory2 } from "react-icons/md";

const Featured_Listing: React.FC = () => {
  const [addProduct, setAddProduct] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<ProductInterface[]>([]);

  const handleCloseAdd = () => {
    setAddProduct(false);
  };

  const getFeaturedProducts = async () => {
    const result = await getFeaturedProductsService();

    if (result?.success) {
      const normalizedProducts: ProductInterface[] = result.products.map((product: any) => ({
        _id: product.id,
        productName: product.name,
        productImage: { url: product.image },
        productDescription: product.description,
        price: product.price,
        rating: product.rating,
        stock: product.stock,
        status: true,
        is_featured: true,
      }));
      setFeaturedProducts(normalizedProducts);
    }
  };

  useEffect(() => {
    getFeaturedProducts();
  }, []);

  const handleRemove = async (id: string) => {
    const result = await featureProductsService(id);
    if (result.success) {
      toast(result.message, {
        position: "bottom-center",
        icon: <FaInfoCircle color="#3995ED" fontSize={20} />,
      });
      getFeaturedProducts();
    } else {
      toast.error(result.error, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-3 ml-4 mr-4">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Featured Products Listing</h1>
          <p className="text-base text-gray-600 mt-1">
            Here's the List of your Featured products.
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-200 text-blue-500 rounded-full shadow-md"
          onClick={() => setAddProduct(true)}
        >
          Featured Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="p-2">
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="w-full h-full">
                  <FeaturedProductCard
                    product={product}
                    onRemove={() => handleRemove(product._id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
            <MdOutlineInventory2 size={60} className="mb-4 text-blue-300" />
            <h2 className="text-lg font-semibold">No Featured Products</h2>
            <p className="text-sm mt-2">You haven't added any featured products yet.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {addProduct && (
        <FeatureProduct
          onClose={handleCloseAdd}
          getFeturedProducts={getFeaturedProducts}
        />
      )}
    </div>
  );
};

export default Featured_Listing;
