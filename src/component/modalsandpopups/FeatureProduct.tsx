"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { ColumnDef } from "@tanstack/react-table";
import ReusableTable from "../ui/ReusableTable";
import { featureProductsService, getProducts } from "@/apiService/productServices";
import { ProductInterface } from "@/types/productTypes";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";

interface FeatureProductProps {
  onClose: () => void;
  getFeturedProducts: () => void
}

const FeatureProduct: React.FC<FeatureProductProps> = ({ onClose, getFeturedProducts }) => {
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const getProduct = async () => {
    const response = await getProducts();

    if (response.success) {
      setProducts(response.product);
      console.log(response.product);
    } else {
      console.log("No Products");
      setProducts([]);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleFeatureProduct = async(id: string) => {
    const result = await featureProductsService(id)

    if(result.success){ 
      toast(result.message, {
        position: "bottom-center",
        icon: <FaInfoCircle color="#3995ED" fontSize={20} />
      });
      getProduct()
      getFeturedProducts()
    }else{ 
      toast.error(result.error, {
        position: "bottom-center",
      });
    }

  };

  const columns: ColumnDef<ProductInterface>[] = [
    {
      header: "Image",
      accessorKey: "image",
      id: "imageColumn",
      cell: ({ row }) => (
        <img
          src={row.original.productImage.url}
          alt={row.original.productName}
          className="w-16 h-16 rounded shadow-md"
        />
      ),
    },
    {
      header: "Name",
      accessorKey: "productName", // updated for correctness
      cell: (info) => info.getValue(),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (info) => info.getValue(),
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (info) => info.getValue(),
    },
    {
      header: "Action",
      id: "featureButton",
      cell: ({ row }) => (
        <button
          className="px-4 py-1 bg-blue-200 text-blue-500 cursor-pointer rounded-full"
          onClick={() => handleFeatureProduct(row.original._id)}
        >
          { row.original.is_featured ? "Remove Feature" : "Feature Product"}
        </button>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50 ml-[16rem]">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full sm:w-[600px] md:w-[700px] lg:w-[850px] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-blue-500 transition"
        >
          <AiOutlineClose size={24} />
        </button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ⭐ Feature a Product
        </h1>

        <ReusableTable columns={columns} data={products} perpage={3} />
      </div>
    </div>
  );
};

export default FeatureProduct;
