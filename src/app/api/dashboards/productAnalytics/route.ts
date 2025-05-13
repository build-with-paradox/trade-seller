import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { mongooseConnection } from "@/lib/mongoconnection";
import Product from "@/models/Product";
import Orders from "@/models/Orders";

export const GET = async (req: NextRequest) => {
  await mongooseConnection();

  try {
    const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!sessionToken) {
      return NextResponse.json(
        { error: "You must be signed in to access this information." },
        { status: 401 }
      );
    }

    const sellerId = sessionToken.id;

    // Fetch all paid orders
    const paidOrders = await Orders.find({
      razorpayOrderId: { $exists: true },
      razorpayPaymentId: { $exists: true },
      razorpaySignature: { $exists: true },
    });

    // Initialize analytics
    let totalRevenue = 0;
    let totalSold = 0;
    let activeProducts = 0;
    let pendingOrders = 0;
    let shippedOrders = 0;
    let returnsAndCancellations = 0;

    const productSalesMap: Record<string, { name: string; sales: number }> = {};

    // GST rate is 18% (can be adjusted as needed)
    const GST_RATE = 0.18;

    for (const order of paidOrders) {
      let isRelevantOrder = false;

      for (const item of order.products) {
        // Fetch product details from DB to get seller info
        const product = await Product.findById(item.productId).lean();

        // Type-cast the product to include seller
        if (product && (product as any).seller?.toString() === sellerId) {
          isRelevantOrder = true;

          if (order.delivery_status === "Cancelled" || order.delivery_status === "Returned") {
            returnsAndCancellations++;
            continue;
          }

          if (order.delivery_status === "Pending") pendingOrders++;
          if (order.delivery_status === "Shipped") shippedOrders++;

          // Calculate the base price and GST
          const basePrice = item.price;  // Product's base price (₹4000 example)
          const gstAmount = basePrice * GST_RATE;  // GST amount (₹720)
          const totalPriceWithGST = basePrice + gstAmount;  // Total price including GST (₹4720)

          // Calculate the revenue for this item
          const orderRevenue = totalPriceWithGST * item.quantity_buyed;

          // Log price and quantity to check values
          console.log(`Product Price: ₹${basePrice}, Quantity: ${item.quantity_buyed}`);
          console.log(`Calculated Revenue for this item: ₹${orderRevenue}`);

          totalRevenue += orderRevenue;
          totalSold += item.quantity_buyed;

          // Track sales by product
          if (!productSalesMap[item.productId]) {
            productSalesMap[item.productId] = {
              name: item.productName,
              sales: 0,
            };
          }

          productSalesMap[item.productId].sales += item.quantity_buyed;
        }
      }
    }

    
    // Count active products
    activeProducts = await Product.countDocuments({
      seller: sellerId,
      approved: true,
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalSold,
        activeProducts,
        pendingOrders,
        shippedOrders,
        returnsAndCancellations,
      },
      topProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
