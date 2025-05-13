import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { mongooseConnection } from "@/lib/mongoconnection";
import Payment from "@/models/Payments";
import PaymentHistory from "@/models/PaymentHistory";
import Order from "@/models/Orders";
import Product from "@/models/Product";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, format } from 'date-fns';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
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

    const orders = await Order.find({
      "products.productId": { $exists: true },
      razorpayPaymentId: { $ne: null },
    }).sort({ createdAt: -1 });

    let totalPayments = 0;
    let netEarnings = 0;
    let refundsAndCancellations = 0;

    const chartData = {
      today: 0,
      last7days: 0,
      weekly: 0,
      monthly: 0,
      yearly: 0,
    };

    const chartLabels: Record<string, string[]> = {
      today: [],
      last7days: [],
      weekly: [],
      monthly: [],
      yearly: [],
    };

    for (const order of orders) {
      let sellerHasProduct = false;

      for (const product of order.products) {
        const productDetails = await Product.findById(product.productId);
        if (!productDetails) continue;

        if (String(productDetails.seller) === String(sellerId)) {
          sellerHasProduct = true;
          break;
        }
      }

      if (sellerHasProduct) {
        totalPayments += order.amount;
        refundsAndCancellations += order.refundAmount || 0;

        // Group orders for chart data based on createdAt
        const createdAt = new Date(order.createdAt);

        // Today's data
        if (isToday(createdAt)) {
          chartData.today += order.amount;
          chartLabels.today.push(format(createdAt, 'hh:mm a'));
        }

        // Last 7 days
        if (isWithinLastDays(createdAt, 7)) {
          chartData.last7days += order.amount;
          chartLabels.last7days.push(format(createdAt, 'E'));
        }

        // Weekly data
        if (isWithinCurrentWeek(createdAt)) {
          chartData.weekly += order.amount;
          chartLabels.weekly.push(`Week ${getWeekNumber(createdAt)}`);
        }

        // Monthly data
        if (isWithinCurrentMonth(createdAt)) {
          chartData.monthly += order.amount;
          chartLabels.monthly.push(format(createdAt, 'MMM'));
        }

        // Yearly data
        if (isWithinCurrentYear(createdAt)) {
          chartData.yearly += order.amount;
          chartLabels.yearly.push(format(createdAt, 'yyyy'));
        }
      }
    }

    netEarnings = totalPayments - refundsAndCancellations;
    const adminShare = Number((netEarnings * 0.05).toFixed(2));
    const netEarningAfterAdmin = Number((netEarnings - adminShare).toFixed(2));

    const paymentRecord = await Payment.findOneAndUpdate(
      { seller: sellerId },
      {
        total_payment: totalPayments,
        admin_share: adminShare,
        refunded_deduct_amount: refundsAndCancellations,
        net_earning: netEarningAfterAdmin,
        pending_payments: totalPayments - (netEarnings + refundsAndCancellations),
      },
      { upsert: true, new: true }
    );

    const paymentHistory = await PaymentHistory.find({ seller: sellerId }).sort({ createdAt: -1 });

    return NextResponse.json({
      payments: paymentRecord,
      paymentHistory: paymentHistory,
      chartData: chartData, // Returning the chart data
      chartLabels: chartLabels, // Returning the chart labels
    });
  } catch (error) {
    console.error("Earnings API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const isWithinLastDays = (date: Date, days: number) => {
  const today = new Date();
  const diffInTime = today.getTime() - date.getTime();
  return diffInTime <= days * 24 * 60 * 60 * 1000; // 24 hours in milliseconds
};

const isWithinCurrentWeek = (date: Date) => {
  const today = new Date();
  const startOfWeekDate = startOfWeek(today);
  return date >= startOfWeekDate && date <= today;
};

const isWithinCurrentMonth = (date: Date) => {
  const today = new Date();
  const startOfMonthDate = startOfMonth(today);
  return date >= startOfMonthDate && date <= today;
};

const isWithinCurrentYear = (date: Date) => {
  const today = new Date();
  const startOfYearDate = startOfYear(today);
  return date >= startOfYearDate && date <= today;
};

const getWeekNumber = (date: Date) => {
  const startDate = startOfWeek(date);
  const diff = date.getTime() - startDate.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
};
