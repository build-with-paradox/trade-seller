"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReusableTable from "@/component/ui/ReusableTable";
import { getOrderedProductsService } from "@/apiService/orderServices";
import DeliveryLoader from "@/component/loaders/loader";

// Backend structure for a single product in an order
interface Product {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity_buyed: number;
  fullProductDetails?: {
    _id: string;
    productName: string;
    productImage: { url: string };
    price: number;
    productCategory?: string;
  };
}

// Backend structure for an order containing multiple products
interface Order {
  order_id: string;
  razorpayOrderId: string; // Ensure razorpayOrderId exists
  products: Product[];
}

// Structure to be shown in the table
interface OrderProduct {
  order_id: string; // This is now coming from razorpayOrderId
  product_id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

const AllOrders = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loader state

  // Fetch orders from backend
  const getOrderedProducts = async () => {
    setLoading(true); // Set loading to true when starting to fetch
    const result = await getOrderedProductsService();

    if (result && result.orders) {
      console.log("orders: ", result.orders[0].products);
      setOrders(result.orders); // ✅ Set full orders, not just products
    }
    setLoading(false); // Set loading to false once data is fetched
  };

  useEffect(() => {
    getOrderedProducts();
  }, []);

  const sellerOrders: OrderProduct[] = useMemo(() => {
    return orders.flatMap((order) =>
      order.products.map((product) => ({
        order_id: order.razorpayOrderId, // Mapping razorpayOrderId as order_id
        product_id: product.productId || product._id,
        productName: product.fullProductDetails?.productName || product.productName,
        productImage: product.fullProductDetails?.productImage?.url || product.productImage,
        price: product.fullProductDetails?.price || product.price,
        quantity: product.quantity_buyed || product.quantity_buyed,
      }))
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return sellerOrders.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, sellerOrders]);

  const columns: ColumnDef<OrderProduct>[] = [
    { accessorKey: "order_id", header: "Order ID" },
    { accessorKey: "product_id", header: "Product ID" },
    {
      accessorKey: "productImage",
      header: "Product Image",
      cell: ({ row }) => (
        <img
          src={row.original.productImage}
          alt={row.original.productName}
          className="w-16 h-16 rounded shadow-md object-cover"
        />
      ),
    },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "price", header: "Price (₹)" },
    { accessorKey: "quantity", header: "Quantity" },
  ];

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mt-4 ml-3">
      <h1 className="text-2xl font-bold text-gray-900">🛒 All Orders</h1>
      <p className="text-sm text-gray-600 mt-2">
        Here's a snapshot of{" "}
        <span className="text-gray-900 font-semibold">📦 Your Products</span> in
        Orders.
      </p>

      {/* Search Box */}
      <div className="mt-5 flex w-full">
        <input
          type="text"
          placeholder="🔍 Search by product name..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loader when data is being fetched */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <DeliveryLoader /> {/* Show the loader component */}
        </div>
      ) : (
        <div className="mt-5">
          <ReusableTable data={filteredOrders} columns={columns} perpage={2} />
        </div>
      )}
    </div>
  );
};

export default AllOrders;
