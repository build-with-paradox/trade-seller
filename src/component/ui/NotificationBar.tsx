"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NotificationBar = ({ message = "https://dribbble.com/shots/24631353-eCommerce-Dashboard" }) => {
  const [progress, setProgress] = useState(100); // Progress from 100 to 0
  const [isVisible, setIsVisible] = useState(true);

  // Decrease progress every 100ms for 10 seconds
  useEffect(() => {
    if (progress > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => prev - 1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      // Auto remove after progress reaches 0
      setIsVisible(false);
    }
  }, [progress]);

  const handleDismiss = () => {
    setIsVisible(false); // Manually dismiss the notification
  };

  if (!isVisible) return null;

  // Define the circumference of the circle
  const radius = 10; // smaller radius for thinner design
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke-dashoffset based on the progress percentage
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-100 to-teal-100 text-teal-800 py-1 px-3 shadow-md rounded-lg max-w-full">
      <div className="flex items-center">
        {/* Circular Progress Bar on the left, styled like a pie chart */}
        <div className="relative w-12 h-12 bg-transparent mr-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            className="absolute inset-0 w-full h-full"
          >
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#e5e7eb" 
              strokeWidth="3"
              fill="none"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              stroke="#38bdf8"
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transition={{
                duration: 10,
                ease: "linear",
              }}
            />
          </svg>

          {/* Center Dot */}
          <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="flex items-center justify-between flex-grow pr-4">
          <p className="text-sm font-medium text-teal-800">{message}</p>

          {/* "Proceed" Button at the end with gap */}
          <button
            className="ml-10 py-1 px-3 bg-white text-teal-600 rounded-md hover:bg-teal-100 transition duration-300 ease-in-out"
            onClick={handleDismiss}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
