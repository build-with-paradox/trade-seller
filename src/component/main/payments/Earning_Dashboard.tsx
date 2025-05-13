"use client";

import { getEarningDashboarService } from "@/apiService/dashboardService";
import AreaChart from "@/component/charts/AreaChart";
import MetricCard from "@/component/ui/MetricCard";
import React, { useEffect, useState } from "react";
import { CiDollar } from "react-icons/ci";
import { LuBadgeIndianRupee } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";

type FilterType = "today" | "last7days" | "weekly" | "monthly" | "yearly";

const Earning_Dashboard = () => {
  const [filter, setFilter] = useState<FilterType>("monthly");
  const [paymentData, setPaymentData] = useState<any>(null); // Storing payment data
  const [chartData, setChartData] = useState<number[]>([]); // Store the chart data based on the filter
  const [chartLabels, setChartLabels] = useState<string[]>([]); // Store the labels for chart

  // Fetching payment data
  const getEarningDashboardValues = async () => {
    const result = await getEarningDashboarService();
    if (result?.success) {
      const { payments, paymentHistory } = result.dashboardvalues;

      // Process data for Metric Cards
      const totalPayments = payments.total_payment;
      const pendingPayments = payments.pending_payments;
      const refundedAmount = payments.refunded_deduct_amount;
      const netEarnings = payments.net_earning;

      setPaymentData({ totalPayments, pendingPayments, refundedAmount, netEarnings });

      // Process data for the chart
      const chartValues: Record<FilterType, number[]> = {
        today: paymentHistory.slice(0, 1).map((history: any) => history.amount),
        last7days: paymentHistory.slice(-7).map((history: any) => history.amount),
        weekly: paymentHistory.map((history: any) => history.amount),
        monthly: paymentHistory.map((history: any) => history.amount),
        yearly: paymentHistory.map((history: any) => history.amount),
      };

      const chartLabelValues: Record<FilterType, string[]> = {
        today: ["12AM"],
        last7days: paymentHistory.slice(-7).map((history: any) => new Date(history.updatedAt).toLocaleDateString("en-GB", { weekday: "short" })),
        weekly: paymentHistory.map((history: any) => new Date(history.updatedAt).toLocaleDateString("en-GB", { month: "short" })),
        monthly: paymentHistory.map((history: any) => new Date(history.updatedAt).toLocaleDateString("en-GB", { month: "short" })),
        yearly: paymentHistory.map((history: any) => new Date(history.updatedAt).getFullYear().toString()),
      };

      setChartData(chartValues[filter]);
      setChartLabels(chartLabelValues[filter]);
    }
  };

  useEffect(() => {
    getEarningDashboardValues();
  }, [filter]);

  // Calculate trend percentage
  const calculateTrendPercentage = (currentValue: number, previousValue: number): number => {
    if (previousValue === 0 || isNaN(currentValue) || isNaN(previousValue)) return 0;
    return parseFloat(((currentValue - previousValue) / previousValue * 100).toFixed(2));
  };

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mt-4 ml-3">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
      <p className="flex text-sm text-gray-600 mt-2">
        <LuBadgeIndianRupee className="mr-2" color="#DAA520" fontSize={22} />
        Here's a snapshot of
        <span className="text-gray-900 font-semibold ml-1 mr-1">All Payments</span> You received.
      </p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {/* Total Payments Received */}
        <MetricCard
          icon={<CiDollar className="text-gray-800" />}
          title="Total Payments"
          value={`₹${paymentData?.totalPayments || "0"}`}
          trend="up"
          trendPercentage={calculateTrendPercentage(paymentData?.totalPayments || 0, paymentData?.totalPayments || 0)}
        />

        {/* Pending Payments */}
        <MetricCard
          icon={<TbReportAnalytics className="text-gray-800" />}
          title="Pending Payments"
          value={`₹${paymentData?.pendingPayments || "0"}`}
          trend="down"
          trendPercentage={calculateTrendPercentage(paymentData?.pendingPayments || 0, paymentData?.pendingPayments || 0)}
        />

        {/* Refunds & Cancellations */}
        <MetricCard
          icon={<TbReportAnalytics className="text-gray-800" />}
          title="Refunds & Cancellations"
          value={`₹${paymentData?.refundedAmount || "0"}`}
          trend="down"
          trendPercentage={calculateTrendPercentage(paymentData?.refundedAmount || 0, paymentData?.refundedAmount || 0)}
        />

        {/* Net Earnings */}
        <MetricCard
          icon={<CiDollar className="text-gray-800" />}
          title="Net Earnings"
          value={`₹${paymentData?.netEarnings || "0"}`}
          trend="up"
          trendPercentage={calculateTrendPercentage(paymentData?.netEarnings || 0, paymentData?.netEarnings || 0)}
        />
      </div>

      {/* Area Chart for Earnings Trend */}
      <div className="mt-6 flex justify-center items-center">
        <div className="w-full max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-800 text-center">Earnings Trend</h2>
          <AreaChart
            data={chartData}
            labels={chartLabels} // Ensuring chartLabels is available here
            width={600}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Earning_Dashboard;
