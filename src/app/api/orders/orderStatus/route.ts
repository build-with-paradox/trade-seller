import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Orders from "@/models/Orders";
import { mongooseConnection } from "@/lib/mongoconnection";
import Product from "@/models/Product";

export const GET = async (req: NextRequest) => {
  try {
    await mongooseConnection();

    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json({ error: "You must be signed in to access this information." }, { status: 401 });
    }

    const sellerId = sessionToken.id;
    const sellerProducts = await Product.find({ seller: sellerId }, '_id');
    const productIds = sellerProducts.map(product => product._id);

    if (productIds.length === 0) {
      return NextResponse.json({
        message: "You don't have any orders for products listed for sale yet.",
        orders: []
      }, { status: 200 });
    }

    const orders = await Orders.find({
      'products.productId': { $in: productIds }
    }).sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => {
      const matchingProducts = order.products.filter((product: any) =>
        productIds.some(id => id.equals(product.productId))
      );

      return {
        id: order._id.toString(),
        order_id: order.razorpayOrderId || order._id.toString(),
        shipment_status: order.delivery_status || "Pending",
        tracking_id: order.razorpayOrderId ? `TRK${order.razorpayOrderId.slice(-8)}` : "N/A", 
        product_count: matchingProducts.length,
        total_amount: order.amount || 0,
      };
    });

    return NextResponse.json({ orders: formattedOrders }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({
      error: "Something went wrong while fetching the orders. Please try again later."
    }, { status: 500 });
  }
}
