"use client";
import { useState, useEffect } from "react";
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

export default function Welcome() {
  const [activeTab, setActiveTab] = useState("Recents");
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      setLoggedIn(true);
      console.log("insideif");
    }
    console.log(typeof loggedIn);
    console.log(`loggedIn = ${loggedIn}`);
    console.log(localStorage);
    console.log(localStorage.getItem("loggedIn"));
  }, []);

  const tabs = [
    { name: "Recents", icon: <Clock size={16} /> },
    { name: "Favorites", icon: <Star size={16} /> },
    { name: "Popular", icon: <TrendingUp size={16} /> },
    { name: "Mosaic AI", icon: <LayoutGrid size={16} /> },
    { name: "What's new", icon: <Bell size={16} />, hasNotification: true },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white flex flex-col items-center p-6 w-full">
      <Hero />
      <Companies />
      <FeatureList />
      <Feature />
      <Pricing />
    </div>
  );
}
