import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { OrderInterface } from '@/types/OrderTypes';
import ReusableTable from "../ui/ReusableTable";

interface OrderDetail {
    product: string;
    description: string;
    color: string; // Assuming color is a hex code or a valid CSS color string
    qty: number;
    price: number;
    total: number;
    image: string; // Add the image URL field
}

interface OrderDetailsProps {
    order: OrderInterface;
    onClose: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
    // Define the columns for the order details table, excluding the total column
    const columns = [
        {
            id: "image",
            header: "Image",
            cell: (info: { row: { original: OrderDetail } }) => (
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
            cell: (info: { row: { original: OrderDetail } }) => info.row.original.product
        },
        {
            id: "description",
            header: "Description",
            cell: (info: { row: { original: OrderDetail } }) => info.row.original.description
        },
        {
            id: "color",
            header: "Color",
            cell: (info: { row: { original: OrderDetail } }) => (
                <div
                    style={{ backgroundColor: info.row.original.color }}
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                ></div>
            )
        },
        {
            id: "qty",
            header: "Quantity",
            cell: (info: { row: { original: OrderDetail } }) => info.row.original.qty
        },
        {
            id: "price",
            header: "Price",
            cell: (info: { row: { original: OrderDetail } }) => `₹${info.row.original.price.toFixed(2)}`
        },
    ];

    // Calculate the total price for the order
    const totalAmount = order.orderDetails.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-md z-50 ml-[16rem]">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4 mx-4 relative w-full md:w-[100%]">
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-600 cursor-pointer">
                    <AiOutlineClose size={24} />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">Orders Details</h1>
                <p className="text-base text-gray-600 mt-2">
                    <span className="text-gray-900 font-semibold">🌟 Order Details</span>.
                </p>

                {/* Render the ReusableTable for displaying the order details */}
                <ReusableTable columns={columns} data={order.orderDetails} perpage={2} />

                {/* Total Amount section */}
                <div className="border-t border-gray-300 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total Amount</span>
                    <span className="text-2xl font-extrabold text-gray-600">₹{totalAmount.toFixed(2)}</span>
                </div>

            </div>
        </div>
    );
};

export default OrderDetails;
