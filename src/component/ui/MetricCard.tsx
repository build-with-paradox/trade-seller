"use client";

import React from "react";
import { BiArrowToTop, BiArrowToBottom } from "react-icons/bi";

// Define the type for the props of the MetricCard component
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: "up" | "down" | "flat" | undefined; // Add "flat" here
  trendPercentage?: number; // Add a field for the dynamic trend percentage
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, trend, trendPercentage }) => {
  // Determine trend icon (up or down)
  const trendIcon = trend === "up" ? (
    <BiArrowToTop className="text-green-500" />
  ) : trend === "down" ? (
    <BiArrowToBottom className="text-red-500" />
  ) : (
    <span className="text-gray-500">—</span> // Default for "flat" trend
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg items-center space-x-4">
      {/* Icon with border and rounded corners */}
      <div className="text-lg text-zinc-200  border-1 border-gray-500 w-7 h-7 flex items-center justify-center rounded-md">
        {icon}
      </div>

      <div className="mt-2">
        <h3 className="text-md text-gray-700">{title}</h3>
        <p className="text-md font-bold text-zinc-800">{value}</p>

        {trend && trend !== "flat" && (
          <div className="flex items-center space-x-1 text-sm mt-2">
            {trendIcon}
            <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
              {trend === "up" ? "+" : "-"} {trendPercentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
