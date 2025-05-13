"use client";

import React, { useEffect, useState } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { OrderInterface } from '@/types/OrderTypes';
import OrderDetails from '@/component/modalsandpopups/Order_details';
import ReusableTable from '@/component/ui/ReusableTable';
import { getPendingOrdersServices } from '@/apiService/orderServices';
import DeliveryLoader from "@/component/loaders/loader"; // Import your loader

const Pending_Orders = () => {
    const [selectedOrder, setSelectedOrder] = useState<OrderInterface | null>(null);
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState<OrderInterface[]>([]); // for API data
    const [loading, setLoading] = useState<boolean>(true); // to show loader

    const getPendingOrders = async () => {
        setLoading(true);
        const result = await getPendingOrdersServices();
        if (result?.success) {
            setOrders(result.orders)
        }
        setLoading(false);
    };

    useEffect(() => {
        getPendingOrders();
    }, []);

    const filteredOrders = orders.filter((order) =>
        order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseOrderDetail = () => {
        setIsOrderDetailOpen(false);
        setSelectedOrder(null);
    };

    const handleOrderDetailClick = (order: OrderInterface) => {
        setSelectedOrder(order);
        setIsOrderDetailOpen(true);
    };

    const columns: ColumnDef<OrderInterface>[] = [
        { id: "order_id", header: "Order ID", cell: (info) => info.row.original.order_id },
        {
            id: "payment",
            header: "Payment",
            cell: (info) => (
                <div className="inline-block px-4 py-2 whitespace-nowrap rounded-full text-xs font-medium bg-green-200 text-green-800">
                    {info.row.original.payment}
                </div>
            ),
        },
        { id: "product_count", header: "Product Count", cell: (info) => info.row.original.product_count },
        { id: "total_amount", header: "Total Amount", cell: (info) => `₹${info.row.original.total_amount.toFixed(2)}` },
        {
            id: "orderDetail",
            header: "Order Detail",
            cell: (info) => (
                <button
                    onClick={() => handleOrderDetailClick(info.row.original)}
                    className="bg-blue-100 text-blue-700 text-sm py-1 px-2 rounded-full whitespace-nowrap cursor-pointer"
                >
                    Order Detail
                </button>
            ),
        },
    ];

    return (
        <>
            <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-4 ml-3">
                <h1 className="text-xl font-semibold text-gray-800">⏳ Pending Orders</h1>
                <p className="text-sm text-gray-600 mt-2">
                    Here's a snapshot of <span className="text-gray-900 font-semibold">⏳ Pending Orders</span> 📦 with 🆔 order ID, 💳 payment status, 📦 product count, and 💰 total amount.
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

                {/* Table or Loader */}
                <div className="flex-1 max-w-full mt-4 overflow-x-auto">
                    {loading ? (
                        <DeliveryLoader /> // 👈 show loader while fetching
                    ) : (
                        <ReusableTable columns={columns} data={filteredOrders} perpage={5} />
                    )}
                </div>
            </div>

            {/* OrderDetails Popup */}
            {isOrderDetailOpen && selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={handleCloseOrderDetail}
                />
            )}
        </>
    );
};

export default Pending_Orders;
