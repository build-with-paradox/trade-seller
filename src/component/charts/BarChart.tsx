"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface BarChartProps {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({ data, labels, width = 400, height = 250 }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Data Set",
        data,
        backgroundColor: "#3498DB",
        borderColor: "#2980B9",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} width={width} height={height} options={{ maintainAspectRatio: false }} />;
};

export default BarChart;
