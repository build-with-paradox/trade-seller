"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineReviews } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import ReviewProductCard from "@/component/ui/ReviewProductCard";
import ProductReviews from "@/component/modalsandpopups/ProductReviews";
import { getProductsAndDetailsService } from "@/apiService/reviewsandfeedback";
import DeliveryLoader from "@/component/loaders/loader";

type Product = {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  quantity: number;
};

const ITEMS_PER_PAGE = 3;

const Reviews_and_Queries = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const handleShowReview = (product: Product) => {
    setSelectedProduct(product);
  };

  const getProductDetails = async () => {
    try {
      const result = await getProductsAndDetailsService();
      if (result.success) {
        setProductList(result.product); // Set API data
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mt-4 ml-3 mr-3">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Reviews and Feedback</h1>
            <p className="flex text-sm text-gray-600 mt-2">
              <MdOutlineReviews className="mr-2" color="#DAA520" fontSize={22} />
              Here's a snapshot of
              <span className="text-gray-900 font-semibold ml-1 mr-1">All Reviews on your Products</span>
              you received from customers.
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 outline-none w-64"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="text-center text-gray-500 mt-6">
            <DeliveryLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ReviewProductCard
                  key={product.id}
                  {...product}
                  showReview={() => handleShowReview(product)}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-sm">
                No products found.
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full cursor-pointer hover:bg-gray-300 disabled:opacity-50"
            >
              <FaChevronLeft className="mr-2" />
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-blue-300 text-blue-500 rounded-full disabled:opacity-50 cursor-pointer"
            >
              Next
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        )}

        {/* Review Modal */}
        {selectedProduct && (
          <ProductReviews product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </>
  );
};

export default Reviews_and_Queries;
