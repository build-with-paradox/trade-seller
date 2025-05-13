// components/PieChart.tsx
"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Registering chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface PieChartProps {
  data: number[];
  labels: string[];
  width?: number;  // Optional width prop
  height?: number; // Optional height prop
}

const PieChart: React.FC<PieChartProps> = ({ data, labels, width = 500, height = 500 }) => {
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

  // Pie chart options for custom sizing
  const options = {
    responsive: true,
    maintainAspectRatio: false,  // Allow custom size
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
