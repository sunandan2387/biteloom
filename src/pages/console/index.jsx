"use client";
import React from "react";
import {
  Search,
  Rocket,
  Star,
  Clock,
  TrendingUp,
  Plus,
  LayoutGrid,
  Bell,
} from "lucide-react";
import Hero from "@/components/home/Hero";
import Companies from "@/components/home/Companies";
import FeatureList from "@/components/home/FeaturesList";
import Feature from "@/components/home/Feature1";
import Pricing from "@/components/home/Pricing";
import { useState } from "react";
import withAuth from "@/hoc/withAuth";

const index = () => {
  const [activeTab, setActiveTab] = useState("Recents");
  const [loggedIn, setLoggedIn] = useState(false);
  const tabs = [
    { name: "Recents", icon: <Clock size={16} /> },
    { name: "Favorites", icon: <Star size={16} /> },
    { name: "Popular", icon: <TrendingUp size={16} /> },
    { name: "Mosaic AI", icon: <LayoutGrid size={16} /> },
    { name: "What's new", icon: <Bell size={16} />, hasNotification: true },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 w-full">
      {/* Search Bar */}
      <div className="w-full max-w-3xl relative mt-12">
        <input
          type="text"
          placeholder="Search clusters, workspaces, recents, and more..."
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2 text-gray-400" size={18} />
      </div>

      {/* Setup Card */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6 max-w-3xl w-full flex items-center">
        <Rocket size={24} className="text-green-400 mr-4" />
        <div className="flex-1">
          <h3 className="font-semibold">Set up your workspace</h3>
          <p className="text-gray-400 text-sm">
            Follow this step-by-step guide to set up your new ByteLoom
            account.
          </p>
        </div>
        <a
          href="/workspace/"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Get started
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tab.name
                ? "bg-gray-700"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon}
            {tab.name}
            {tab.hasNotification && (
              <span className="ml-1 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Start Journey Section */}
      <div className="mt-24 text-center border border-dashed border-gray-600 p-6 rounded-lg bg-gray-600 bg-opacity-20 max-w-lg">
        <h2 className="text-xl font-semibold">Start your journey</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Try the "New" menu, where you can use github repository to run spark
          jobs
        </p>
        <button className="mt-4 bg-blue-500 mx-auto hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} />
          New
        </button>
      </div>
    </div>
  );
};

export default withAuth(index);
