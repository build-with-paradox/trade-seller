import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { mongooseConnection } from "@/lib/mongoconnection";
import Product from "@/models/Product";
import Orders from "@/models/Orders";

import { startOfDay, startOfWeek, startOfMonth, startOfYear, isAfter, format } from "date-fns";

interface OrderProduct {
  productId: string;
  price: number;
  quantity_buyed: number;
}

interface Order {
  products: OrderProduct[];
  delivery_status: "Pending" | "Shipped" | "Cancelled" | "Refunded" | string;
  createdAt: Date;
}

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

    const sellerProducts = await Product.find({ seller: sellerId }).select("_id");
    const productIds = sellerProducts.map((p: any) => p._id.toString());
    const totalProducts = sellerProducts.length;

    const orders: Order[] = await Orders.find({
      "products.productId": { $in: productIds },
    }).sort({ createdAt: -1 });

    let totalRevenue = 0;
    let totalOrders = 0;
    let pendingOrders = 0;
    let shippedOrders = 0;
    let returns = 0;

    const now = new Date();
    const chartData = {
      yearly: 0,
      monthly: 0,
      weekly: 0,
      today: 0,
    };

    const chartLabels: {
      yearly: string[];
      monthly: string[];
      weekly: string[];
      today: string[];
    } = {
      yearly: [],
      monthly: [],
      weekly: [],
      today: [],
    };

    const startOfToday = startOfDay(now);
    const startOfWeekDate = startOfWeek(now);
    const startOfMonthDate = startOfMonth(now);
    const startOfYearDate = startOfYear(now);

    const recentPayouts: any[] = [];

    // GST rate is 18% (can be adjusted as needed)
    const GST_RATE = 0.18;

    // Calculate chart data and labels based on the createdAt date of each order
    orders.forEach((order) => {
      let relevant = false;

      order.products.forEach((product) => {
        if (productIds.includes(product.productId.toString())) {
          const basePrice = product.price; // Product base price
          const gstAmount = basePrice * GST_RATE; // GST amount (₹720)
          const totalPriceWithGST = basePrice + gstAmount; // Total price including GST (₹4720)

          const revenue = totalPriceWithGST * product.quantity_buyed; // Total revenue including GST for the item

          totalRevenue += revenue;
          totalOrders += 1;
          relevant = true;

          // Assign revenue to chartData based on the `createdAt` of the order
          if (isAfter(order.createdAt, startOfYearDate)) {
            chartData.yearly += revenue;
            chartLabels.yearly.push(format(order.createdAt, "yyy")); // Label for Year
          }

          if (isAfter(order.createdAt, startOfMonthDate)) {
            chartData.monthly += revenue;
            chartLabels.monthly.push(format(order.createdAt, "MMM")); // Label for Month
          }

          if (isAfter(order.createdAt, startOfWeekDate)) {
            chartData.weekly += revenue;
            chartLabels.weekly.push(format(order.createdAt, "ccc")); // Label for Weekday
          }

          if (isAfter(order.createdAt, startOfToday)) {
            chartData.today += revenue;
            chartLabels.today.push(format(order.createdAt, "hh a")); // Label for Time of the Day
          }
        }
      });

      if (relevant) {
        if (order.delivery_status === "Pending") pendingOrders += 1;
        if (order.delivery_status === "Shipped") shippedOrders += 1;
        if (["Cancelled", "Refunded"].includes(order.delivery_status)) returns += 1;

        if (recentPayouts.length < 3) {
          recentPayouts.push({
            id: (order as any)._id,
            date: order.createdAt,
            delivery_status: order.delivery_status,
            products: order.products.filter((p) => productIds.includes(p.productId.toString())),
          });
        }
      }
    });

    return NextResponse.json(
      {
        totalRevenue,
        totalOrders,
        pendingOrders,
        shippedOrders,
        returns,
        totalProducts,
        chartData,
        chartLabels,  // Return chart labels with the data
        recentPayouts,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
