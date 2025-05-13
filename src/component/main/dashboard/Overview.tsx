"use client";
import React, { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { CiDollar } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineTruck, HiOutlineCheckCircle } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import MetricCard from "@/component/ui/MetricCard";
import NotificationBar from "@/component/ui/NotificationBar";
import DonutChart from "@/component/charts/DonutChart";
import AreaChart from "@/component/charts/AreaChart";
import RecentPayouts from "./RecentPayouts";
import { getDashboarService } from "@/apiService/dashboardService";
import DeliveryLoader from "@/component/loaders/loader";

type FilterType = "today" | "last7days" | "weekly" | "monthly" | "yearly";

const Overview: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>("monthly");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    returns: 0,
    totalProducts: 0,
    chartData: {
      today: 0,
      last7days: 0,
      weekly: 0,
      monthly: 0,
      yearly: 0,
    },
    chartLabels: {
      today: [],
      last7days: [],
      weekly: [],
      monthly: [],
      yearly: [],
    },
    recentPayouts: [],
  });

  const dashboardvalues = async () => {
    const result = await getDashboarService();
    if (result?.success) {
      setDashboardData(result.dashboardvalues);
    }
    setLoading(false);
  };

  useEffect(() => {
    dashboardvalues();
  }, []);

  const {
    totalRevenue,
    totalOrders,
    pendingOrders,
    shippedOrders,
    returns,
    totalProducts,
    chartData,
    chartLabels,
    recentPayouts,
  } = dashboardData;

  const safePercentage = (value: number): number =>
    totalOrders > 0 ? parseFloat(((value / totalOrders) * 100).toFixed(2)) : 0;

  const shippedPercentage = safePercentage(shippedOrders);
  const pendingPercentage = safePercentage(pendingOrders);
  const returnedPercentage = safePercentage(returns);
  const remainingPercentage = safePercentage(totalOrders - (shippedOrders + pendingOrders + returns));

  const calculateTrendPercentage = (currentValue: number, previousValue: number): number => {
    if (previousValue === 0 || isNaN(currentValue) || isNaN(previousValue)) return 0;
    return parseFloat(((currentValue - previousValue) / previousValue * 100).toFixed(2));
  };

  const chartLabelData = chartLabels[filter] || [];
  const chartValueData = chartData[filter] ? [chartData[filter]] : [];
  
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-3 ml-2">
      <h1 className="text-2xl font-semibold text-gray-800">Seller Dashboard</h1>
      <p className="text-base text-gray-600 mt-2">
        🚀 Welcome back, <span className="text-gray-900 font-semibold">Seller!</span> Here’s an overview of your store’s performance.
      </p>

      <div className="mt-8">
        <NotificationBar />
      </div>

      {
        loading ? (
          <div className="flex justify-center items-center h-60 mt-6">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 w-full flex justify-center items-center">
              <DeliveryLoader />
            </div>
          </div>
        ) : (
          <>
            {/* Donut Chart + Metric Cards side by side */}
            <div className="flex flex-col lg:flex-row gap-6 mt-6">

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                <MetricCard
                  icon={<CiDollar className="text-gray-800" />}
                  title="Total Revenue"
                  value={`₹${totalRevenue.toLocaleString()}`}
                  trend="up"
                  trendPercentage={calculateTrendPercentage(chartData.monthly, chartData.monthly)}
                />
                <MetricCard
                  icon={<GiShoppingCart className="text-gray-800" />}
                  title="Total Orders"
                  value={totalOrders.toString()}
                  trend="up"
                  trendPercentage={calculateTrendPercentage(chartData.monthly, chartData.monthly)}
                />
                <MetricCard
                  icon={<FaBoxOpen className="text-gray-800" />}
                  title="Active Listings"
                  value={totalProducts.toString()}
                  trend="up"
                  trendPercentage={calculateTrendPercentage(chartData.monthly, chartData.monthly)}
                />
                <MetricCard
                  icon={<HiOutlineTruck className="text-gray-800" />}
                  title="Pending Orders"
                  value={pendingOrders.toString()}
                  trend="down"
                  trendPercentage={calculateTrendPercentage(chartData.monthly, chartData.monthly)}
                />
                <MetricCard
                  icon={<HiOutlineCheckCircle className="text-gray-800" />}
                  title="Shipped Orders"
                  value={shippedOrders.toString()}
                  trend="up"
                  trendPercentage={calculateTrendPercentage(chartData.monthly, chartData.monthly)}
                />
                <MetricCard
                  icon={<TbReportAnalytics className="text-gray-800" />}
                  title="Returns & Cancellations"
                  value={returns.toString()}
                  trend="down"
                  trendPercentage={calculateTrendPercentage(chartData.monthly, chartData.monthly)}
                />
              </div>

              {/* Donut Chart */}
              <div className="w-full lg:max-w-xs shadow-md rounded-lg flex flex-col items-center justify-center p-4">
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Orders Breakdown</h3>
                <DonutChart
                  data={[shippedPercentage, pendingPercentage, returnedPercentage, remainingPercentage]}
                  labels={["Completed", "Pending", "Returned", "Shipped"]}
                />
              </div>

            </div>

            {/* Sales Trend + Payouts */}
            <div className="flex flex-col lg:flex-row mt-6 gap-6">
              <div className="w-full lg:w-1/2 shadow-md rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h1 className="font-bold text-gray-800">Sales Trend</h1>
                  <select
                    className="bg-white border border-gray-300 rounded-md pl-3 pr-3 py-1 text-sm focus:outline-none cursor-pointer"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterType)}
                  >
                    <option value="today">Today</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <AreaChart data={chartValueData} labels={chartLabelData} />
              </div>

              <div className="w-full lg:w-1/2">
                <RecentPayouts settlements={recentPayouts} />
              </div>
            </div>
          </>
        )
      }

    </div>
  );
};

export default Overview;
