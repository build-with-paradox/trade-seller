import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TransactionInterface } from "@/types/TransactionTypes";
import ReusableTable from "../ui/ReusableTable";

interface TransactionDetailsItem {
    id: number;
    product: string;
    description: string;
    color: string;
    qty: number;
    price: number;
    total: number;
    image: string;
}

interface TransactionDetailsProps {
    transaction: TransactionInterface;
    onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
    const columns = [
        {
            id: "image",
            header: "Image",
            cell: (info: { row: { original: TransactionDetailsItem } }) => (
                <img
                    src={info.row.original.image}
                    alt={info.row.original.product}
                    className="w-16 h-16 rounded-md object-cover"
                />
            )
        },
        {
            id: "product",
            header: "Product",
            cell: (info: { row: { original: TransactionDetailsItem } }) => info.row.original.product
        },
        {
            id: "description",
            header: "Description",
            cell: (info: { row: { original: TransactionDetailsItem } }) => info.row.original.description
        },
        {
            id: "color",
            header: "Color",
            cell: (info: { row: { original: TransactionDetailsItem } }) => (
                <div
                    style={{ backgroundColor: info.row.original.color }}
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                ></div>
            )
        },
        {
            id: "qty",
            header: "Quantity",
            cell: (info: { row: { original: TransactionDetailsItem } }) => info.row.original.qty
        },
        {
            id: "price",
            header: "Price",
            cell: (info: { row: { original: TransactionDetailsItem } }) => `₹${info.row.original.price.toFixed(2)}`
        },
    ];

    const totalAmount = transaction.orderDetails?.reduce((sum: number, item: TransactionDetailsItem) => {
        return sum + item.total;
    }, 0) || 0;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-md z-50 ml-[16rem]">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4 mx-4 relative w-full md:w-[100%]">
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-600 cursor-pointer">
                    <AiOutlineClose size={24} />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">Orders Details</h1>
                <p className="text-base text-gray-600 mt-2">
                    🌟 <span className="text-gray-900 font-semibold">Transaction Details</span>.
                </p>

                {/* Only render table if data exists */}
                {transaction.orderDetails && (
                    <ReusableTable
                        columns={columns}
                        data={transaction.orderDetails}
                        perpage={2}
                    />
                )}

                {/* Total Amount section */}
                <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total Amount</span>
                    <span className="text-2xl font-extrabold text-gray-600">₹{totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
