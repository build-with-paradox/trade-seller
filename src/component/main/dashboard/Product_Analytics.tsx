"use client";

import React, { useState, useEffect } from "react";
import MetricCard from "@/component/ui/MetricCard";
import { FaBoxOpen } from "react-icons/fa";
import { CiDollar } from "react-icons/ci";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineTruck, HiOutlineCheckCircle } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import DonutChart from "@/component/charts/DonutChart";
import DeliveryLoader from "@/component/loaders/loader"; // Assuming this is your loader component
import { getProductAnalyticsService } from "@/apiService/dashboardService";

const ProductAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<number[] | null>(null);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const productAnalytics = async () => {
    const result = await getProductAnalyticsService();

    if (result?.success) {
      // Update state with the API data
      const { stats, topProducts } = result.productanalytics;

      // Set analytics data (e.g. totalRevenue, totalSold, etc.)
      setAnalyticsData([
        stats.totalRevenue,
        stats.totalSold,
        stats.activeProducts,
        stats.pendingOrders,
        stats.shippedOrders,
        stats.returnsAndCancellations,
      ]);

      // Set top-selling products
      setTopProducts(topProducts);
      setLoading(false);
    } else {
      // Handle error here
      console.error("Failed to fetch product analytics data");
      setLoading(false);
    }
  };

  useEffect(() => {
    productAnalytics();
  }, []);

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-3 ml-4">
      {/* Static Content */}
      <h1 className="text-2xl font-semibold text-gray-800">Total Product Analytics</h1>
      <p className="text-base text-gray-600 mt-2">
        Here's the overall performance of your products.
      </p>

      {/* Loader for data fetching */}
      {loading ? (
        <div className="flex justify-center items-center h-60 w-full mt-6">
          <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 w-full flex justify-center items-center">
            <DeliveryLoader />
          </div>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-5">
            <MetricCard
              icon={<CiDollar className="text-gray-800" />}
              title="Total Revenue"
              value={`₹${analyticsData![0].toLocaleString()}`}
            />
            <MetricCard
              icon={<GiShoppingCart className="text-gray-800" />}
              title="Total Products Sold"
              value={analyticsData![1].toLocaleString()}
            />
            <MetricCard
              icon={<FaBoxOpen className="text-gray-800" />}
              title="Active Products"
              value={analyticsData![2].toLocaleString()}
            />
            <MetricCard
              icon={<HiOutlineTruck className="text-gray-800" />}
              title="Pending Orders"
              value={analyticsData![3].toLocaleString()}
            />
            <MetricCard
              icon={<HiOutlineCheckCircle className="text-gray-800" />}
              title="Shipped Orders"
              value={analyticsData![4].toLocaleString()}
            />
            <MetricCard
              icon={<TbReportAnalytics className="text-gray-800" />}
              title="Returns & Cancellations"
              value={analyticsData![5].toLocaleString()}
            />
          </div>

          {/* Top 5 Selling Products Chart */}
          <div className="orders-chart mt-6 lg:col-span-1 flex flex-col items-center justify-center shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-4 mt-3">
              Top 5 Selling Products
            </h3>
            <DonutChart
              data={topProducts.map((product) => product.sales)}
              labels={topProducts.map((product) => product.name)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAnalytics;
