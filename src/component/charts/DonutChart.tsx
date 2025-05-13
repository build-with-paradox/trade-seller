// components/DonutChart.tsx
"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Registering chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface DonutChartProps {
  data: number[];
  labels: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#B8E6FE", "#F3F4F6", "#FC747B", "#1877F2"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default DonutChart;
