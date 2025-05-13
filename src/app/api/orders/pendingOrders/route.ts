import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Product from "@/models/Product";
import Orders from "@/models/Orders";
import { mongooseConnection } from "@/lib/mongoconnection";

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

      const orderDetails = matchingProducts.map((product: any) => ({
        id: product._id.toString(),
        product: product.productName,
        image: product.productImage,
        description: product.productDescription,
        qty: product.quantity_buyed || 1,
        price: product.price,
        total: product.price * (product.quantity_buyed || 1),
      }));

      return {
        id: order._id.toString(),
        order_id: order.razorpayOrderId || order._id.toString(), 
        payment: order.razorpayPaymentId ? "Paid" : "Pending", 
        product_count: orderDetails.length,
        total_amount: order.amount || 0,
        totalRevenue: order.amount || 0,
        orderDetails: orderDetails
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
