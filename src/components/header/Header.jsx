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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  }, [user]);

  // Logout function
  const handleLogout = () => {
    setUser(null);
    logout();
    localStorage.removeItem("authToken"); // Clear authToken from localStorage
    toast.success("Logged out successfully");
    router.push("/auth/login");
    // Also close the mobile menu if it is open
    setMobileMenuOpen(false);
  };

  const routes = [
    { title: "Workspace", link: "/workspace" },
    { title: "Computes", link: "/compute-list" },
    { title: "Pricing", link: "/pricing" },
    { title: "About", link: "/about" },
  ];

  return (
    <>
      <header
        className={
          user
            ? "flex justify-between items-center bg-[#0d131f] text-white px-3 py-2.5 fixed w-full z-50"
            : "flex justify-between items-center bg-[#121212] text-white px-3 py-2.5 fixed w-full z-50"
        }
      >
        {/* Logo */}
        <Link href="/" className="flex gap-3">
          <Icons.Command />
          <p>ByteLoom</p>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex">
          <Nav items={routes} />
        </div>

        {/* Right-side Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Menu - visible only on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="focus:outline-none"
            >
              <Icons.Menu />
            </button>
          </div>

          {/* Theme Switcher */}
          <div ref={dropdownRef} className="relative">
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
                  onClick={() => {
                    setTheme("light");
                    setIsOpen(false);
                  }}
                >
                  Light
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => {
                    setTheme("dark");
                    setIsOpen(false);
                  }}
                >
                  Dark
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                  onClick={() => {
                    setTheme("system");
                    setIsOpen(false);
                  }}
                >
                  System
                </button>
              </div>
            )}
          </div>

          {/* Desktop User Menu */}
          {!user ? (
            <nav className="hidden md:block">
              <Link
                href="/auth/login"
                className="inline-flex items-center bg-[#1e293b] px-6 py-2 rounded-md text-white"
              >
                Try ByteLoom
              </Link>
            </nav>
          ) : (
            <div className="relative hidden md:block" ref={userDropdownRef}>
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
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-[#121212] text-white z-40 shadow-lg">
          <nav className="flex flex-col">
            {routes.map((route, index) => (
              <Link
                key={index}
                href={route.link}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
              >
                {route.title}
              </Link>
            ))}
            {/* Mobile User Actions */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
              >
                Try ByteLoom
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
