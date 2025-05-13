"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import ReusableTable from "@/component/ui/ReusableTable";
import CustomerComplain from "@/component/modalsandpopups/CustomerComplains";

// Fake data for cancelled orders
const cancelledOrders = [
    {
        id: 101,
        order_id: "ORD1001",
        status: "Cancelled",
        reason: "Customer Request",
        product_count: 2,
        total_amount: 1499.00,
        image: "https://m.media-amazon.com/images/I/61egMfcDWlL._SX679_.jpg",
        name: "Premium Laptop Bag",
        description: "Waterproof and durable laptop bag with multiple compartments.",
        price: 749.50,
        rating: 4.6,
        quantity: 2,
        customer_name: "Amit Verma",
        ordered_at: "2024-06-12 14:32:45",
        cancelled_at: "2024-06-13 10:15:30",
    },
    {
        id: 102,
        order_id: "ORD1002",
        status: "Cancelled",
        reason: "Payment Declined",
        product_count: 1,
        total_amount: 1999.00,
        image: "https://m.media-amazon.com/images/I/61BoaOUf+KL._AC_UY218_.jpg",
        name: "Smartwatch Pro",
        description: "Advanced fitness tracker with a heart rate monitor and AMOLED display.",
        price: 1999.00,
        rating: 4.3,
        quantity: 1,
        customer_name: "Rohit Sharma",
        ordered_at: "2024-06-11 18:50:21",
        cancelled_at: "2024-06-12 09:40:05",
    },
    {
        id: 103,
        order_id: "ORD1003",
        status: "Cancelled",
        reason: "Out of Stock",
        product_count: 3,
        total_amount: 2897.50,
        image: "https://m.media-amazon.com/images/I/51RaySTbIVL._AC_UY218_.jpg",
        name: "Wireless Earbuds X",
        description: "Premium noise-cancelling earbuds with 40-hour battery life.",
        price: 965.83,
        rating: 4.7,
        quantity: 3,
        customer_name: "Priya Kapoor",
        ordered_at: "2024-06-10 22:15:10",
        cancelled_at: "2024-06-11 08:30:00",
    },
    {
        id: 104,
        order_id: "ORD1004",
        status: "Cancelled",
        reason: "Delayed Shipping",
        product_count: 1,
        total_amount: 799.00,
        image: "https://m.media-amazon.com/images/I/81tioCUVf4L._AC_UY218_.jpg",
        name: "Gaming Mouse RGB",
        description: "Ergonomic gaming mouse with customizable RGB lighting and buttons.",
        price: 799.00,
        rating: 4.5,
        quantity: 1,
        customer_name: "Sandeep Nair",
        ordered_at: "2024-06-09 12:42:30",
        cancelled_at: "2024-06-10 10:45:15",
    },
    {
        id: 105,
        order_id: "ORD1005",
        status: "Cancelled",
        reason: "Defective Item Received",
        product_count: 1,
        total_amount: 3999.00,
        image: "https://m.media-amazon.com/images/I/81JG5E6nJXL._AC_UY218_.jpg",
        name: "Mechanical Keyboard Pro",
        description: "High-performance mechanical keyboard with blue switches for tactile feedback.",
        price: 3999.00,
        rating: 4.8,
        quantity: 1,
        customer_name: "Neha Gupta",
        ordered_at: "2024-06-08 16:10:05",
        cancelled_at: "2024-06-09 07:55:30",
    }
];


const Cancelled_Orders = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<typeof cancelledOrders[0] | null>(null);


    const filteredOrders = cancelledOrders.filter((order) =>
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: ColumnDef<typeof cancelledOrders[0]>[] = [
        { id: "order_id", header: "Order ID", cell: (info) => info.row.original.order_id },
        { id: "status", header: "Status", cell: (info) => (
            <div className="px-4 py-2 rounded-full text-sm font-medium bg-red-200 text-red-800">
                {info.row.original.status}
            </div>
        ) },
        { id: "product_count", header: "Total Products", cell: (info) => info.row.original.product_count },
        { id: "total_amount", header: "Total Amount", cell: (info) => `₹${info.row.original.total_amount.toFixed(2)}` },
        { id: "reason", header: "Reason", cell: (info) => (
            <button
                className="px-3 py-1 text-md font-medium text-blue-500 bg-blue-200 cursor-pointer rounded-full"
                onClick={() => setSelectedOrder(info.row.original)} // Open modal
            >
                {info.row.original.reason}
            </button>
        ) },
    ];

    return (
        <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-4 ml-3">
            <h1 className="text-xl font-semibold text-gray-800">❌ Cancelled Orders</h1>
            <p className="text-sm text-gray-600 mt-2">
                Below are the <span className="text-gray-900 font-semibold">❌ Cancelled Orders</span> 🚫 with order ID, status, reason, total products, and total amount.
            </p>

            {/* Search Box */}
            <div className="mt-5 flex w-full">
                <input
                    type="text"
                    placeholder="🔍 Search by Order ID..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="flex-1 max-w-full mt-4 overflow-x-auto">
                <ReusableTable columns={columns} data={filteredOrders} perpage={3} />
            </div>

            {/* Show CustomerComplain Modal when an order is selected */}
            {selectedOrder && (
                <CustomerComplain
                    product={selectedOrder}
                    onClose={() => setSelectedOrder(null)} // Close modal
                />
            )}
        </div>
    );
};

export default Cancelled_Orders;
