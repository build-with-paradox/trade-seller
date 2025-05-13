"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  MdDashboard, MdShoppingCart, MdStore, MdInventory, MdLocalOffer,
  MdAttachMoney, MdOutlineAnalytics, MdPeople,
  MdOutlineShoppingCart, MdOutlineCategory, MdOutlineReport, MdOutlineLocalOffer,
  MdOutlineAttachMoney, MdOutlineSupportAgent, MdOutlineRateReview
} from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contextapis/authentication/AuthProvider";
import { LogOut } from "lucide-react";
import { Truck } from "lucide-react"


const SellerSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard", icon: <MdDashboard />, links: [
        { name: "Overview", icon: <MdOutlineAnalytics />, path: "/" },
        { name: "Product Analytics", icon: <MdOutlineCategory /> },
        { name: "Sales Insights", icon: <MdOutlineReport /> }
      ]
    },
    {
      title: "My Products", icon: <MdInventory />, links: [
        { name: "Products", icon: <MdStore /> },
        { name: "Pending Approvals", icon: <MdOutlineReport /> }
      ]
    },
    {
      title: "Orders", icon: <MdShoppingCart />, links: [
        { name: "All Orders", icon: <MdOutlineShoppingCart /> },
        { name: "Pending Orders", icon: <MdOutlineReport /> },
        { name: "Order Status", icon: <Truck className="h-4 w-4 text-gray-700"/> },
        { name: "Cancelled Orders", icon: <MdOutlineReport /> }
      ]
    },
    {
      title: "Payments", icon: <MdAttachMoney />, links: [
        { name: "Earnings Dashboard", icon: <MdOutlineAttachMoney /> },
        // { name: "Withdraw Funds", icon: <MdOutlinePayments /> },
        { name: "Transaction History", icon: <MdOutlineAnalytics /> }
      ]
    },
    {
      title: "Promotions", icon: <MdLocalOffer />, links: [
        { name: "Manage Discounts", icon: <MdOutlineLocalOffer /> },
        { name: "Featured Listings", icon: <MdOutlineShoppingCart /> }
      ]
    },
    {
      title: "Customers", icon: <MdPeople />, links: [
        { name: "Reviews & Feedback", icon: <MdOutlineRateReview /> }
      ]
    },
  ];


  return (
    isAuthenticated && (
      <aside className="w-64 bg-white shadow-md fixed left-0 top-0 h-screen p-4 flex flex-col">
        {/* Logo */}
        <div className="text-xl font-semibold text-gray-800 h-16 mb-5">
          <Image className="ml-10" src='/assets/nest-seller.jpg' height={100} width={100} alt="Seller Dashboard" />
        </div>

        <hr className="w-[16.3rem] -ml-5 text-gray-200 mb-5" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pr-2">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center space-x-2 text-gray-700 font-semibold text-md mb-1">
                {section.icon}
                <span>{section.title}</span>
              </div>

              <ul className="mb-4">
                {section.links.map((link, subIdx) => {
                  const linkPath = link.path || `/${link.name.toLowerCase().replace(/\s+/g, "-")}`;
                  const isActive = pathname === linkPath;
                  return (
                    <li key={subIdx}>
                      <Link
                        href={linkPath}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-md transition 
                          ${isActive ? "bg-blue-200 bg-opacity-50 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:bg-opacity-50"}
                        `}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}

              </ul>
            </div>
          ))}

          <button
            onClick={logout}
            className="w-full text-left text-sm cursor-pointer px-4 py-2 flex items-center gap-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>

        </nav>

        <hr className="w-[16.3rem] -ml-5 text-gray-200 mt-5" />

        <div className="p-4 text-gray-600 text-sm">
          © 2025 Seller Dashboard. All Rights Reserved.
        </div>
      </aside>
    )
  );
};

export default SellerSidebar;
