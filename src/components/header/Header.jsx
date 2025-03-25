"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Nav } from "./Navbar";
import { Icons } from "../ui/icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation"; // Fix here: use next/navigation instead of next/router
import { useAuth } from "@/context/SessionProvider";
import { toast } from "react-toastify";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const router = useRouter();

  // Get authentication state
  const { logout, user } = useAuth();
  const [user1, setUser] = useState(null);

  // Fetch user from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (user) {
      // Assume user is logged in if token exists
      setUser({ name: user.name }); // Modify this if you fetch actual user data
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    setUser(null);
    logout();
    localStorage.removeItem("authToken"); // Clear authToken from localStorage
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

 
  const routes = [
    { title: "Doc", link: "/doc" },
    { title: "Blogs", link: "/blogs" },
    { title: "About", link: "/about-us" },
    { title: "Contact Us", link: "/contact-us" },
  ];
  return (
    <div
      className={
        user
          ? `flex justify-between items-center bg-[#0d131f] text-white px-3 py-2.5 fixed w-full`
          : `flex justify-between items-center bg-[#121212] text-white px-3 py-2.5 fixed w-full`
      }
    >
      {/* Logo */}
      <Link href="/" className="flex gap-3">
        <Icons.Command />
        <p>ByteLoom</p>
      </Link>

      {/* Navigation Links */}
      <Nav items={routes} />
      {/* Right-side Menu */}
      <div className="flex justify-center gap-3 items-center text-white relative">
        {/* Theme Switcher */}
        <div ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <Icons.Moon />
          </button>
          {isOpen && (
            <div className="absolute right-[40%] top-[85%] mt-2 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => setTheme("light")}
              >
                Light
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                onClick={() => setTheme("system")}
              >
                System
              </button>
            </div>
          )}
        </div>

        {/* Show Login Button if No User */}
        {!user ? (
          <nav className="my-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center bg-[#1e293b] px-6 py-2 rounded-md text-white"
            >
              Try ByteLoom
            </Link>
          </nav>
        ) : (
          // If User is Logged In, Show User Icon with Dropdown
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="focus:outline-none flex items-center gap-2"
            >
              <Icons.User className="w-6 h-6" />
              <span className="hidden md:inline">{user.name}</span>
            </button>

            {userOpen && (
              <div className="absolute right-0 top-[85%] mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-white hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
