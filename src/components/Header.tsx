"use client";
import { CartContext } from "@/views/plugins/Context";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import apiInstance from "@/utils/axios";
import CartId from "@/views/plugins/CartId";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MagnifyingGlassIcon as SearchIcon, 
  ShoppingCartIcon, 
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    apiInstance
      .get<CartItem[]>(`course/cart-list/${CartId()}/`)
      .then((response) => {
        const cartItems = response.data;
        setCartCount(cartItems.length);
      });
  }, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-b from-primaryCustom-100 to-primaryCustom-300 shadow-sm'} border-b border-gray-200`}>
        <div className="container mx-auto px-4 ">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div   
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-buttonsCustom-900 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-800">
                  STARLORD
                </span>
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-buttonsCustom-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/pages/contact-us/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/pages/contact-us/' ? 'text-buttonsCustom-600 bg-buttonsCustom-50' : 'text-gray-700 hover:text-buttonsCustom-600'}`}
              >
                Contact
              </Link>

              <Link
                href="/pages/about-us/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/pages/about-us/' ? 'text-buttonsCustom-600 bg-buttonsCustom-50' : 'text-gray-700 hover:text-buttonsCustom-600'}`}
              >
                About
              </Link>

              {/* Instructor Dropdown */}
              <div className="relative group">
                <button className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.includes('/instructor/') ? 'text-buttonsCustom-600 bg-buttonsCustom-50' : 'text-gray-700 hover:text-buttonsCustom-600'}`}>
                  Instructor
                  <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-10 hidden group-hover:block border border-gray-100"
                >
                  {[
                    { path: "/instructor/dashboard/", text: "Dashboard" },
                    { path: "/instructor/courses/", text: "My Courses" },
                    { path: "/instructor/create-course/", text: "Create Course" },
                    { path: "/instructor/reviews/", text: "Reviews" },
                    { path: "/instructor/question-answer/", text: "Q/A" },
                    { path: "/instructor/students/", text: "Students" },
                    { path: "/instructor/earning/", text: "Earning" },
                    { path: "/instructor/profile/", text: "Settings" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block px-4 py-2 text-sm transition-colors ${pathname === item.path ? 'bg-buttonsCustom-50 text-buttonsCustom-600' : 'text-gray-700 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600'}`}
                    >
                      {item.text}
                    </Link>
                  ))}
                </motion.div>
              </div>

              {/* Student Dropdown */}
              <div className="relative group">
                <button className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname.includes('/student/') ? 'text-buttonsCustom-600 bg-buttonsCustom-50' : 'text-gray-700 hover:text-buttonsCustom-600'}`}>
                  Student
                  <ChevronDownIcon className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 hidden group-hover:block border border-gray-100"
                >
                  {[
                    { path: "/student/dashboard/", text: "Dashboard" },
                    { path: "/student/courses/", text: "My Courses" },
                    { path: "/student/wishlist/", text: "Wishlist" },
                    { path: "/student/question-answer/", text: "Q/A" },
                    { path: "/student/profile/", text: "Profile" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block px-4 py-2 text-sm transition-colors ${pathname === item.path ? 'bg-buttonsCustom-50 text-buttonsCustom-600' : 'text-gray-700 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600'}`}
                    >
                      {item.text}
                    </Link>
                  ))}
                </motion.div>
              </div>
            </nav>

            {/* Search and Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search Courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 pl-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent w-64 border border-gray-200 text-sm"
                />
                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </motion.div>

              {!isLoggedIn() ? (
                <>
                  {pathname !== "/login/" && (
                    <Link
                      href="/login/"
                      className="px-4 py-2 text-buttonsCustom-600 border border-buttonsCustom-600 rounded-full hover:bg-buttonsCustom-50 transition-colors text-sm font-medium"
                    >
                      Login
                    </Link>
                  )}
                  {pathname !== "/register/" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/register/"
                        className="px-4 py-2 bg-gradient-to-r from-buttonsCustom-600 to-buttonsCustom-700 text-white rounded-full hover:from-buttonsCustom-700 hover:to-buttonsCustom-800 transition-colors text-sm font-medium shadow-sm"
                      >
                        Register
                      </Link>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/cart/"
                    className="relative p-2 text-gray-700 hover:text-buttonsCustom-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-buttonsCustom-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/logout/"
                    className="px-4 py-2 bg-buttonsCustom-800 text-white rounded-full hover:bg-buttonsCustom-900 transition-colors text-sm font-medium"
                  >
                    Logout
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-2 pb-4 space-y-2">
                  <div className="relative px-2">
                    <input
                      type="text"
                      placeholder="Search Courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-50 text-gray-800 px-4 pl-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent w-full border border-gray-200 text-sm"
                    />
                    <SearchIcon className="absolute left-5 top-2.5 h-4 w-4 text-gray-400" />
                  </div>

                  <Link
                    href="/pages/contact-us/"
                    className="block px-4 py-2 text-gray-700 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600 rounded-md transition-colors"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/pages/about-us/"
                    className="block px-4 py-2 text-gray-700 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600 rounded-md transition-colors"
                  >
                    About
                  </Link>

                  {/* Mobile Instructor Dropdown */}
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600 rounded-md transition-colors cursor-pointer list-none">
                      <span>Instructor</span>
                      <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-4 mt-1 space-y-1">
                      {[
                        { path: "/instructor/dashboard/", text: "Dashboard" },
                        { path: "/instructor/courses/", text: "My Courses" },
                        { path: "/instructor/create-course/", text: "Create Course" },
                        { path: "/instructor/reviews/", text: "Reviews" },
                        { path: "/instructor/question-answer/", text: "Q/A" },
                        { path: "/instructor/students/", text: "Students" },
                        { path: "/instructor/earning/", text: "Earning" },
                        { path: "/instructor/profile/", text: "Settings" },
                      ].map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600 rounded-md transition-colors"
                        >
                          {item.text}
                        </Link>
                      ))}
                    </div>
                  </details>

                  {/* Mobile Student Dropdown */}
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600 rounded-md transition-colors cursor-pointer list-none">
                      <span>Student</span>
                      <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-4 mt-1 space-y-1">
                      {[
                        { path: "/student/dashboard/", text: "Dashboard" },
                        { path: "/student/courses/", text: "My Courses" },
                        { path: "/student/wishlist/", text: "Wishlist" },
                        { path: "/student/question-answer/", text: "Q/A" },
                        { path: "/student/profile/", text: "Profile" },
                      ].map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-buttonsCustom-50 hover:text-buttonsCustom-600 rounded-md transition-colors"
                        >
                          {item.text}
                        </Link>
                      ))}
                    </div>
                  </details>

                  <div className="border-t border-gray-200 pt-2 mt-2">
                    {!isLoggedIn() ? (
                      <div className="flex space-x-2 px-2">
                        {pathname !== "/login/" && (
                          <Link
                            href="/login/"
                            className="flex-1 text-center px-4 py-2 text-buttonsCustom-600 border border-buttonsCustom-600 rounded-full hover:bg-buttonsCustom-50 transition-colors text-sm font-medium"
                          >
                            Login
                          </Link>
                        )}
                        {pathname !== "/register/" && (
                          <Link
                            href="/register/"
                            className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-buttonsCustom-600 to-buttonsCustom-700 text-white rounded-full hover:from-buttonsCustom-700 hover:to-buttonsCustom-800 transition-colors text-sm font-medium"
                          >
                            Register
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-2">
                        <Link
                          href="/cart/"
                          className="relative p-2 text-gray-700 hover:text-buttonsCustom-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-buttonsCustom-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/logout/"
                          className="px-4 py-2 bg-buttonsCustom-800 text-white rounded-full hover:bg-buttonsCustom-900 transition-colors text-sm font-medium"
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </CartContext.Provider>
  );
}

export default BaseHeader;