// components/LineChart.tsx
"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from "chart.js";

// Registering chart components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

interface LineChartProps {
  data: number[];
  labels: string[];
}

const LineChart: React.FC<LineChartProps> = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Line Data",
        data,
        borderColor: "#8E44AD",
        backgroundColor: "rgba(142, 68, 173, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
