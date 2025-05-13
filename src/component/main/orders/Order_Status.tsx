"use client";

import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { OrderStatusInterface } from '@/types/OrderTypes';
import ReusableTable from '@/component/ui/ReusableTable';
import { getOrderStatusService } from '@/apiService/orderServices';

// The API call will return this data
const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
        "Shipped": "bg-yellow-200 text-yellow-800",
        "Out for Delivery": "bg-blue-200 text-blue-800",
        "Delivered": "bg-green-200 text-green-800",
        "Pending": "bg-gray-200 text-gray-800"
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>{status}</span>;
};

const Order_Status = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState<OrderStatusInterface[]>([]);

    const filteredOrders = orders.filter((order) =>
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: ColumnDef<typeof orders[0]>[] = [
        { id: "order_id", header: "Order ID", cell: (info) => info.row.original.order_id },
        { id: "shipment_status", header: "Shipment Status", cell: (info) => getStatusBadge(info.row.original.shipment_status) },
        { id: "tracking_id", header: "Tracking ID", cell: (info) => info.row.original.tracking_id },
        { id: "product_count", header: "Total Products", cell: (info) => info.row.original.product_count },
        { id: "total_amount", header: "Total Amount", cell: (info) => `₹${info.row.original.total_amount.toFixed(2)}` },
    ];

    const getOrderStatus = async() => {
        const result = await getOrderStatusService();

        if(result.success) {
            setOrders(result.orders);
            console.log("Order Status: ", result.orders);
        } else {
            console.log("Error fetching order status");
        }
    }

    useEffect(() => { 
        getOrderStatus();
    }, []);

    return (
        <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-4 ml-3">
            <h1 className="text-xl font-semibold text-gray-800">📦 Order Status</h1>
            <p className="text-sm text-gray-600 mt-2">
                Here are all the <span className="text-gray-900 font-semibold">📦 Order Status</span> 🚚 with order ID, shipment status, tracking ID, total products, and total amount.
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
                <ReusableTable columns={columns} data={filteredOrders} perpage={5} />
            </div>
        </div>
    );
};

export default Order_Status;
