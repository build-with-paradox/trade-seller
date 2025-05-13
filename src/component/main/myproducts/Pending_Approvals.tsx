"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReusableTable from "@/component/ui/ReusableTable";
import { getProductsApprovalDetails } from "@/apiService/productServices";
import { ProductInterface } from "@/types/productTypes";
import toast from "react-hot-toast";
import { FaCircleInfo } from "react-icons/fa6";

type Product = {
  image: string;
  name: string;
  price: number;
  quantity: number;
  approval: string;
};

// Table columns
const columns: ColumnDef<Product>[] = [
  {
    id: "imageColumn",
    accessorKey: "image",
    header: "Image",
    cell: ({ getValue }) => (
      <img src={getValue() as string} alt="Product" className="w-16 h-16 rounded-md" />
    ),
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "price",
    header: "Price (₹)",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "approval",
    header: "Approval",
    cell: ({ getValue }) => {
      const approval = getValue() as string;
      return (
        <span
          className={`px-3 py-1 rounded-full ${
            approval === "Pending"
              ? "bg-blue-200 text-blue-500"
              : "bg-green-200 text-green-500"
          }`}
        >
          {approval}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const approval = row.getValue("approval") as string;
      const isApproved = approval === "Approved";
  
      return (
        <div className="flex gap-2">
          <button
            className={`px-4 py-1 rounded-full ${
              isApproved
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-200 text-indigo-500 cursor-pointer"
            }`}
            onClick={() => {
              if (isApproved) return;
              toast('Product sended for reapproval', {
                icon: <FaCircleInfo color="#528AFD" />,
              });
            }}
          >
            Re-Approval
          </button>
        </div>
      );
    },
  }
  
];

const Pending_Approvals = () => {
  const [productDetails, setProductDetails] = useState<Product[]>([]);

  const getProductApprovals = async () => {
    const response = await getProductsApprovalDetails();

    if (response.success) {
      const formattedProducts = response.product.map((product: any) => ({
        image: product.productImage.url,
        name: product.productName,
        price: product.price,
        stock: product.stock,
        approval: product.approved ? "Approved" : "Pending"
      }));
      setProductDetails(formattedProducts);
    } else {
      console.log("No Products");
      setProductDetails([]);
    }
  };

  useEffect(() => {
    getProductApprovals();
  }, []);

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-5 ml-4 mr-4">
      <h1 className="text-2xl font-semibold text-gray-800">Pending Approvals</h1>
      <p className="text-base text-gray-600 mt-1">
        Here's the list of pending approvals for your products.
      </p>

      <div className="mt-6">
        <ReusableTable columns={columns} data={productDetails} perpage={3} />
      </div>
    </div>
  );
};

export default Pending_Approvals;
