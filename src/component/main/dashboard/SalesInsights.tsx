"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MetricCard from "@/component/ui/MetricCard";
import { CiDollar } from "react-icons/ci";
import { TbReportAnalytics } from "react-icons/tb";
import { HiOutlineCheckCircle, HiOutlineTruck } from "react-icons/hi2";
import DonutChart from "@/component/charts/DonutChart";
import DeliveryLoader from "@/component/loaders/loader";
import { getSalesInsightsService } from "@/apiService/dashboardService";

const SalesInsights = () => {
  const [salesData, setSalesData] = useState<{
    bestSelling: { name: string; image: string; sales: number };
    leastSelling: { name: string; image: string; sales: number };
    totalRevenue: number;
    totalOrders: number;
    returns: number;
    growthRate: string;
    peakTime: string;
  } | null>(null);

  useEffect(() => {
    const fetchSalesInsights = async () => {
      try {
        const result = await getSalesInsightsService();

        if (result?.success) {
          const data = result.salesinsights;

          setSalesData({
            bestSelling: data.bestSellingProduct,
            leastSelling: data.leastSellingProduct,
            totalRevenue: data.totalRevenue,
            totalOrders: data.totalOrders,
            returns: data.returns || 0,
            growthRate: data.growthRate || "N/A",
            peakTime: data.peakTime || "N/A",
          });

          console.log("salesData: ", data);
        }
      } catch (error) {
        console.error("Error fetching sales insights:", error);
      }
    };

    fetchSalesInsights();
  }, []);

  return (
    <div className="flex justify-center p-4 ml-10">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 mt-3 max-w-8xl w-full">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Sales Insights</h1>
        <p className="text-base text-gray-600 mt-2 text-center">
          Here's the overall insights regarding sales.
        </p>

        {!salesData ? (
          <div className="flex justify-center items-center p-4 mt-6">
            <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 w-full flex justify-center items-center">
              <DeliveryLoader />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 mt-4">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4 shadow-sm">
                <Image
                  src={salesData.bestSelling.image}
                  alt={salesData.bestSelling.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="text-sm text-gray-500">Best-Selling Product</p>
                  <h3 className="text-lg font-semibold">{salesData.bestSelling.name}</h3>
                  <p className="text-sm text-gray-600">{salesData.bestSelling.sales} sales</p>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4 shadow-sm">
                <Image
                  src={salesData.leastSelling.image}
                  alt={salesData.leastSelling.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="text-sm text-gray-500">Least-Selling Product</p>
                  <h3 className="text-lg font-semibold">{salesData.leastSelling.name}</h3>
                  <p className="text-sm text-gray-600">{salesData.leastSelling.sales} sales</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
                <MetricCard
                  icon={<CiDollar className="text-gray-800" />}
                  title="Average Order Value"
                  value={`₹${(salesData.totalRevenue / salesData.totalOrders).toFixed(2)}`}
                />
                <MetricCard
                  icon={<TbReportAnalytics className="text-gray-800" />}
                  title="Return & Cancellation Rate"
                  value={`${((salesData.returns / salesData.totalOrders) * 100).toFixed(2)}%`}
                />
                <MetricCard
                  icon={<HiOutlineCheckCircle className="text-gray-800" />}
                  title="Sales Growth Rate"
                  value={salesData.growthRate}
                />
                <MetricCard
                  icon={<HiOutlineTruck className="text-gray-800" />}
                  title="Peak Sales Time"
                  value={salesData.peakTime}
                />
              </div>

              <div className="bg-white p-5 shadow-md rounded-lg flex flex-col items-center w-full lg:w-1/3">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Distribution</h2>
                <DonutChart
                  data={[salesData.bestSelling.sales, salesData.leastSelling.sales]}
                  labels={[salesData.bestSelling.name, salesData.leastSelling.name]}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesInsights;
