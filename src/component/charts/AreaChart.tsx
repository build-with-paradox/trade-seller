"use client";

import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface AreaChartProps {
    data: number[];
    labels: string[];
    width?: number;
    height?: number;
}

const AreaChart: React.FC<AreaChartProps> = ({ data, labels, width = 500, height = 250 }) => {
    // Check if the latest value is lower than the previous value
    const isDowntrend = data.length > 1 && data[data.length - 1] < data[data.length - 2];

    // Set colors based on trend
    const primaryColor = isDowntrend ? "rgba(255, 140, 0, 1)" : "rgba(14, 165, 233, 1)"; // Orange if down, Sky-500 if up
    const fillColor = isDowntrend ? "rgba(255, 140, 0, 0.2)" : "rgba(14, 165, 233, 0.2)";

    const chartData = {
        labels,
        datasets: [
            {
                label: "Sales",
                data,
                borderColor: primaryColor,
                backgroundColor: fillColor,
                pointBackgroundColor: primaryColor,
                pointBorderColor: primaryColor,
                pointHoverBackgroundColor: primaryColor,
                pointHoverBorderColor: primaryColor,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // Hide vertical grid lines
                },
            },
            y: {
                grid: {
                    color: "rgba(200, 200, 200, 0.2)", // Light gray grid lines
                },
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-lg " style={{ width, height }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default AreaChart;

