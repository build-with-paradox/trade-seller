"use client";

import React, { useState } from "react";
import ReusableTable from "@/component/ui/ReusableTable";
import { ColumnDef } from "@tanstack/react-table";
import { TransactionInterface } from "@/types/TransactionTypes";
import TransactionDetails from "@/component/modalsandpopups/TransactionDetails";

// Sample transaction data
const transactions: TransactionInterface[] = [
  {
    transaction_id: "TXN1001",
    order_id: "ORD1001",
    total_payment: "₹2499",
    transaction_status: "Completed",
    admin_share: "₹499",
    seller_share: "₹2000",
    orderDetails: [
      {
        id: 1,
        product: "Noise Smartwatch ColorFit Pro 4",
        image: "https://m.media-amazon.com/images/I/71TPda7cwUL._SX679_.jpg",
        description: "1.8'' AMOLED Display, BT Calling, 100 Sports Modes",
        color: "Jet Black",
        qty: 1,
        price: 2499,
        total: 2499,
      },
    ],
  },
  {
    transaction_id: "TXN1002",
    order_id: "ORD1002",
    total_payment: "₹789",
    transaction_status: "Pending",
    admin_share: "₹100",
    seller_share: "₹689",
    orderDetails: [
      {
        id: 1,
        product: "boAt BassHeads 100 Wired Earphones",
        image: "https://m.media-amazon.com/images/I/61RbuW8tG3L._SX679_.jpg",
        description: "Wired Headset with Mic, Powerful Bass",
        color: "Black",
        qty: 1,
        price: 789,
        total: 789,
      },
    ],
  },
  {
    transaction_id: "TXN1003",
    order_id: "ORD1003",
    total_payment: "₹3598",
    transaction_status: "Out for Delivery",
    admin_share: "₹598",
    seller_share: "₹3000",
    orderDetails: [
      {
        id: 1,
        product: "AmazonBasics Laptop Backpack",
        image: "https://m.media-amazon.com/images/I/81s6DUyQCZL._SX679_.jpg",
        description: "Water-Resistant, 15.6-Inch Laptop Compartment",
        color: "Grey",
        qty: 1,
        price: 1199,
        total: 1199,
      },
      {
        id: 2,
        product: "Redgear Pro Wireless Gamepad",
        image: "https://m.media-amazon.com/images/I/61rJbP+0ZsL._SX679_.jpg",
        description: "2.4GHz Wireless, Built-in Rechargeable Battery",
        color: "Black",
        qty: 1,
        price: 2399,
        total: 2399,
      },
    ],
  },
  {
    transaction_id: "TXN1004",
    order_id: "ORD1004",
    total_payment: "₹1798",
    transaction_status: "Completed",
    admin_share: "₹298",
    seller_share: "₹1500",
    orderDetails: [
      {
        id: 1,
        product: "Puma Men’s Sneakers",
        image: "https://m.media-amazon.com/images/I/71V--WZVUIL._UX695_.jpg",
        description: "Casual Wear, Lace-Up, Comfortable Sole",
        color: "Navy Blue",
        qty: 1,
        price: 1798,
        total: 1798,
      },
    ],
  },
  {
    transaction_id: "TXN1005",
    order_id: "ORD1005",
    total_payment: "₹1025",
    transaction_status: "Pending",
    admin_share: "₹225",
    seller_share: "₹800",
    orderDetails: [
      {
        id: 1,
        product: "Philips Trimmer BT1232",
        image: "https://m.media-amazon.com/images/I/51WhJ1oAe8L._SX679_.jpg",
        description: "USB Charging, Skin-Friendly Blades",
        color: "Green",
        qty: 1,
        price: 1025,
        total: 1025,
      },
    ],
  },
];


// Status badge generator
const getStatusBadge = (status: string) => {
  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-200 text-yellow-800",
    "Out for Delivery": "bg-blue-200 text-blue-800",
    Completed: "bg-green-200 text-green-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

const TransactionHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState<TransactionInterface | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // Handle opening order detail modal
  const handleOrderDetails = (order: TransactionInterface) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // Handle closing modal
  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
  };

  // Define table columns
  const columns: ColumnDef<TransactionInterface>[] = [
    { header: "Transaction ID", accessorKey: "transaction_id" },
    { header: "Order ID", accessorKey: "order_id" },
    { header: "Total Payment", accessorKey: "total_payment" },
    {
      header: "Transaction Status",
      accessorKey: "transaction_status",
      cell: (info) => getStatusBadge(info.row.original.transaction_status),
    },
    { header: "Admin Share", accessorKey: "admin_share" },
    { header: "Seller Share", accessorKey: "seller_share" },
    {
      header: "Order Details",
      accessorKey: "order_details",
      cell: (info) => (
        <button
          onClick={() => handleOrderDetails(info.row.original)}
          className="bg-blue-100 text-blue-700 text-sm py-1 px-2 rounded-full whitespace-nowrap cursor-pointer"
        >
          Order Details
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mt-10 ml-4">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-sm text-gray-600 mt-2">Overview of all your transactions.</p>

        {/* Table */}
        <ReusableTable columns={columns} data={transactions} perpage={3} />
      </div>

      {/* OrderDetails Modal */}
      {isOrderDetailOpen && selectedOrder && (
        <TransactionDetails transaction={selectedOrder} onClose={handleCloseOrderDetail} />
      )}
    </>
  );
};

export default TransactionHistory;
