"use client";
import { CartContext } from "@/views/plugins/Context";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import apiInstance from "@/utils/axios";
import CartId from "@/views/plugins/CartId";

interface CartItem {
  id: string;
  price: number;
  course: {
    title: string;
    image: string;
  };
}
function BaseHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    apiInstance
      .get<CartItem[]>(`course/cart-list/${CartId()}/`)
      .then((response) => {
        const cartItems = response.data;
        setCartCount(cartItems.length);
      });
  }, []);

  return (
    <CartContext.Provider value={[cartCount,setCartCount]}>
    <header className="bg-gradient-to-b from-primaryCustom-100 to-primaryCustom-300 shadow-sm border-b border-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-indigo-600"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                  fill="#800000"
                />
                <path
                  d="M19.0765 10.8926L16.0971 7.99999L7 14.2077L10.0077 16.9908L19.0765 10.8926Z"
                  fill="white"
                />
                <path
                  d="M22.1074 13.9235L25 16.9029L18.7923 26L16.0092 22.9923L22.1074 13.9235Z"
                  fill="white"
                />
                <path
                  d="M12.8936 13.9235L9.92114 16.8846L16.1154 23.0789L19.0775 20.1064L12.8936 13.9235Z"
                  fill="white"
                />
              </svg>
              <span className="ml-2 text-2xl font-bold text-gray-800">
                STARLORD
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/pages/contact-us/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>

            <Link
              href="/pages/about-us/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>

            {/* Instructor Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                Instructor
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100">
                {[
                  { path: "/instructor/dashboard/", text: "Dashboard" },
                  { path: "/instructor/courses/", text: "My Courses" },
                  { path: "/instructor/create-course/", text: "Create Course" },
                  { path: "/instructor/reviews/", text: "Reviews" },
                  { path: "/instructor/question-answer/", text: "Q/A" },
                  { path: "/instructor/students/", text: "Students" },
                  { path: "/instructor/earning/", text: "Earning" },
                  { path: "/instructor/profile/", text: "Settings & Profile" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>

            {/* Student Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                Student
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-gray-100">
                {[
                  { path: "/student/dashboard/", text: "Dashboard" },
                  { path: "/student/courses/", text: "My Courses" },
                  { path: "/student/wishlist/", text: "Wishlist" },
                  { path: "/student/question-answer/", text: "Q/A" },
                  { path: "/student/profile/", text: "Profile & Settings" },
                ].map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Search and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64 border border-gray-200"
              />
              <button
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                aria-label="Search"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {!isLoggedIn() && pathname !== "/login/" && (
              <Link
                href="/login/"
                className="px-4 py-2 text-buttonsCustom-600 border border-buttonsCustom-600 rounded-lg hover:bg-buttonsCustom-600 hover:text-white transition-colors text-sm font-medium"
              >
                Login
              </Link>
            )}
            {!isLoggedIn() && pathname !== "/register/" && (
              <Link
                href="/register/"
                className="px-4 py-2 bg-buttonsCustom-600 text-white rounded-lg hover:bg-buttonsCustom-700 transition-colors text-sm font-medium"
              >
                Register
              </Link>
            )}
            {isLoggedIn() && pathname !== "/register/" && (
            <Link
              href="/cart/"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center"
            >
              <span>Cart ({cartCount})</span>
              <svg
                className="ml-1 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </Link>
             )}
             {isLoggedIn() && pathname !== "/logout/" && (
              <Link
                href="/logout/"
                className="px-4 py-2 bg-buttonsCustom-900 text-white rounded-lg hover:bg-buttonsCustom-800 transition-colors text-sm font-medium"
              >
                Logout
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 mt-2">
              <Link
                href="/pages/contact-us/"
                className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact Us
              </Link>
              <Link
                href="/pages/about-us/"
                className="text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About Us
              </Link>

              {/* Mobile Instructor Dropdown */}
              <div className="px-3 py-2">
                <button
                  className="text-gray-700 hover:text-indigo-600 w-full text-left text-sm font-medium"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Instructor
                </button>
                <div className="mt-1 ml-4 space-y-1">
                  {[
                    { path: "/instructor/dashboard/", text: "Dashboard" },
                    { path: "/instructor/courses/", text: "My Courses" },
                    {
                      path: "/instructor/create-course/",
                      text: "Create Course",
                    },
                    { path: "/instructor/reviews/", text: "Reviews" },
                    { path: "/instructor/question-answer/", text: "Q/A" },
                    { path: "/instructor/students/", text: "Students" },
                    { path: "/instructor/earning/", text: "Earning" },
                    {
                      path: "/instructor/profile/",
                      text: "Settings & Profile",
                    },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Student Dropdown */}
              <div className="px-3 py-2">
                <button
                  className="text-gray-700 hover:text-indigo-600 w-full text-left text-sm font-medium"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Student
                </button>
                <div className="mt-1 ml-4 space-y-1">
                  {[
                    { path: "/student/dashboard/", text: "Dashboard" },
                    { path: "/student/courses/", text: "My Courses" },
                    { path: "/student/wishlist/", text: "Wishlist" },
                    { path: "/student/question-answer/", text: "Q/A" },
                    { path: "/student/profile/", text: "Profile & Settings" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                    >
                      {item.text}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="px-3 pt-2">
                <input
                  type="text"
                  placeholder="Search Courses"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full border border-gray-200"
                />
              </div>

              {!isLoggedIn() && pathname !== "/login/" && (
                <Link
                  href="/login/"
                  className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors text-sm font-medium"
                >
                  Login
                </Link>
              )}
              {!isLoggedIn() && pathname !== "/register/" && (
                <Link
                  href="/register/"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Register
                </Link>
              )}

              <Link
                href="/cart/"
                className="mx-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <span>Cart ({cartCount})</span>
                <svg
                  className="ml-1 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
    </CartContext.Provider>
  );
}

export default BaseHeader;
