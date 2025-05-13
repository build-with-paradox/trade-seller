"use client";

import React, { useEffect, useState } from "react";
import { BiSolidDiscount } from "react-icons/bi";
import ReusableTable from "@/component/ui/ReusableTable";
import { ColumnDef } from "@tanstack/react-table";
import Manage_Discount from "@/component/modalsandpopups/ManageDiscount";
import { getProducts } from "@/apiService/productServices";
import { FaStar } from "react-icons/fa"; // optional, for styling rating

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

const ManageDiscounts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleManageClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const getProduct = async () => {
    const response = await getProducts();

    if (response.success) {
      const formattedProducts = response.product.map((item: any): Product => ({
        id: item._id, 
        name: item.productName, 
        image: item.productImage?.url || "",
        price: item.price,
        discount: item.discount || 0, 
        description: item.productDescription,
        rating: item.rating,
        quantity: item.stock, 
      }));

      setProducts(formattedProducts);
      console.log("Formatted Products: ", formattedProducts)
    } else {
      console.log("No Products");
    }
  };


  useEffect(()=> {
    getProduct()
  }, [])
  // ✅ Updated columns
  const columns: ColumnDef<Product>[] = [
    {
      header: "Product ID",
      accessorKey: "id",
      cell: ({ getValue }) => {
        const fullId = getValue() as string;
        const shortId = fullId.slice(0, 8); // or however many chars you want
        return <span title={fullId}>{shortId}...</span>; // Optional tooltip
      },
    },    
    {
      header: "Name",
      accessorKey: "name", // Adjusted to match 'name' in formatted data
    },
    {
      header: "Image",
      accessorKey: "image", // Adjusted to match 'image' in formatted data
      cell: ({ row }) => (
        <img
          src={row.original.image} // Adjusted to match 'image' in formatted data
          alt="Product"
          className="w-12 h-12 rounded object-cover shadow-md"
        />
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: ({ getValue }) => `₹${getValue()}`,
    },
    {
      header: "Discount",
      accessorKey: "discount",
      cell: ({ getValue }) => `${getValue() ?? 0}%`,
    },
    {
      header: "Description",
      accessorKey: "description", // Adjusted to match 'description' in formatted data
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-700 line-clamp-2">
          {getValue() as string}
        </span>
      ),
    },
    {
      header: "Stock", // Renaming this column to 'Stock'
      accessorKey: "quantity", // Adjusted to match 'quantity' in formatted data
    },
    {
      header: "Manage",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <button
            className="bg-blue-200 text-blue-500 text-md px-3 py-1 whitespace-nowrap rounded-full cursor-pointer"
            onClick={() => handleManageClick(product)}
          >
            Manage Discount
          </button>
        );
      },
    },
  ];

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mt-4 ml-4">
      <h1 className="text-2xl font-bold text-gray-900">Manage Discounts</h1>
      <p className="flex text-sm text-gray-600 mt-2 items-center">
        <BiSolidDiscount className="mr-2" color="#DAA520" fontSize={22} />
        Manage <span className="text-gray-900 font-semibold mx-1">Discounts</span> on your products.
      </p>

      {/* ✅ Table with live data */}
      <div className="mt-6">
        <ReusableTable columns={columns} data={products} />
      </div>

      {/* ✅ Modal */}
      {isModalOpen && selectedProduct && (
        <Manage_Discount product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ManageDiscounts;
