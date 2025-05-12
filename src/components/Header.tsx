"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCart } from "@/providers/CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Shadcn UI components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Lucide icons
import {
  Search,
  ShoppingCart,
  Menu as MenuIcon,
  X as XIcon,
  ChevronDown,
  Heart,
  Laptop,
  Users,
  BookOpenCheck,
  MessageSquare,
  Settings,
  IndianRupee,
  LogOut,
  UserRound,
} from "lucide-react";

function BaseHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, allUserData } = useAuthStore();
  const { cartCount } = useCart();
  
  // Get teacher ID from user data
  const teacherId = allUserData?.teacher_id || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Navigation items for Instructor and Student
  const instructorItems = [
    { path: "/instructor/dashboard/", text: "Dashboard", icon: <Laptop className="h-4 w-4" /> },
    { path: "/instructor/courses/", text: "My Courses", icon: <BookOpenCheck className="h-4 w-4" /> },
    { path: "/instructor/create-course/", text: "Create Course", icon: <BookOpenCheck className="h-4 w-4" /> },
    { path: "/instructor/reviews/", text: "Reviews", icon: <MessageSquare className="h-4 w-4" /> },
    { path: "/instructor/question-answer/", text: "Q/A", icon: <MessageSquare className="h-4 w-4" /> },
    { path: "/instructor/students/", text: "Students", icon: <Users className="h-4 w-4" /> },
    { path: "/instructor/earning/", text: "Earning", icon: <IndianRupee className="h-4 w-4" /> },
    { path: "/instructor/profile/", text: "Settings", icon: <Settings className="h-4 w-4" /> },
  ];

  const studentItems = [
    { path: "/student/dashboard/", text: "Dashboard", icon: <Laptop className="h-4 w-4" /> },
    { path: "/student/courses/", text: "My Courses", icon: <BookOpenCheck className="h-4 w-4" /> },
    { path: "/student/wishlist/", text: "Wishlist", icon: <Heart className="h-4 w-4" /> },
    { path: "/student/question-answer/", text: "Q/A", icon: <MessageSquare className="h-4 w-4" /> },
    { path: "/student/profile/", text: "Profile", icon: <UserRound className="h-4 w-4" /> },
  ];

  return (
    <header 
      className={cn(
        "fixed w-full z-50 transition-all duration-300 border-b", 
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md border-gray-200" 
          : "bg-gradient-to-b from-primaryCustom-100 to-primaryCustom-300 border-gray-200/50"
      )}
    >
      <div className="container mx-auto px-4">
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/contact-us/" legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === '/contact-us/' && "bg-accent text-accent-foreground"
                    )}
                  >
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about-us/" legacyBehavior passHref>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === '/about-us/' && "bg-accent text-accent-foreground"
                    )}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {/* Instructor Menu - Show when user is logged in AND teacherId > 0 */}
              {isLoggedIn() && teacherId > 0 && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      pathname.includes('/instructor/') && "bg-accent text-accent-foreground"
                    )}
                  >
                    Instructor
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-2 md:w-[500px] md:grid-cols-2">
                      {instructorItems.map((item) => (
                        <li key={item.path}>
                          <Link href={item.path} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "flex w-full select-none items-center gap-2 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                pathname === item.path && "bg-accent text-accent-foreground"
                              )}
                            >
                              {item.icon}
                              <span>{item.text}</span>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}

              {/* Student Menu - Show when user is logged in AND teacherId = 0 */}
              {isLoggedIn() && teacherId === 0 && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      pathname.includes('/student/') && "bg-accent text-accent-foreground"
                    )}
                  >
                    Student
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-2">
                      {studentItems.map((item) => (
                        <li key={item.path}>
                          <Link href={item.path} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={cn(
                                "flex w-full select-none items-center gap-2 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                pathname === item.path && "bg-accent text-accent-foreground"
                              )}
                            >
                              {item.icon}
                              <span>{item.text}</span>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search Courses..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-64 pl-10 rounded-full"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            {!isLoggedIn() ? (
              <>
                {pathname !== "/login/" && (
                  <Button
                    variant="outline"
                    className="rounded-full border-buttonsCustom-600 text-buttonsCustom-600 hover:bg-buttonsCustom-50"
                    asChild
                  >
                    <Link href="/login/">Login</Link>
                  </Button>
                )}
                {pathname !== "/register/" && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="rounded-full bg-gradient-to-r from-buttonsCustom-600 to-buttonsCustom-700 hover:from-buttonsCustom-700 hover:to-buttonsCustom-800"
                      asChild
                    >
                      <Link href="/register/">Register</Link>
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                  asChild
                >
                  <Link href="/cart/">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-buttonsCustom-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  className="rounded-full bg-buttonsCustom-800 hover:bg-buttonsCustom-900"
                  asChild
                >
                  <Link href="/logout/">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </Button>
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
                  <Input
                    type="text"
                    placeholder="Search Courses..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 w-full rounded-full"
                  />
                  <Search className="absolute left-5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>

                <Link
                  href="/contact-us/"
                  className={cn(
                    "block px-4 py-2 text-sm rounded-md transition-colors", 
                    pathname === '/contact-us/' 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  Contact
                </Link>
                
                <Link
                  href="/about-us/"
                  className={cn(
                    "block px-4 py-2 text-sm rounded-md transition-colors", 
                    pathname === '/about-us/' 
                      ? "bg-accent text-accent-foreground" 
                      : "hover:bg-accent/50"
                  )}
                >
                  About
                </Link>

                {/* Mobile Instructor Dropdown - only show when user is logged in AND teacherId > 0 */}
                {isLoggedIn() && teacherId > 0 && (
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors hover:bg-accent/50 cursor-pointer list-none">
                      <span>Instructor</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-4 mt-1 space-y-1">
                      {instructorItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors", 
                            pathname === item.path 
                              ? "bg-accent text-accent-foreground" 
                              : "hover:bg-accent/50"
                          )}
                        >
                          {item.icon}
                          <span>{item.text}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                )}

                {/* Mobile Student Dropdown - only show when user is logged in AND teacherId = 0 */}
                {isLoggedIn() && teacherId === 0 && (
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors hover:bg-accent/50 cursor-pointer list-none">
                      <span>Student</span>
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-4 mt-1 space-y-1">
                      {studentItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors", 
                            pathname === item.path 
                              ? "bg-accent text-accent-foreground" 
                              : "hover:bg-accent/50"
                          )}
                        >
                          {item.icon}
                          <span>{item.text}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                )}

                <div className="border-t border-gray-200/70 pt-2 mt-2">
                  {!isLoggedIn() ? (
                    <div className="flex space-x-2 px-2">
                      {pathname !== "/login/" && (
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full border-buttonsCustom-600 text-buttonsCustom-600 hover:bg-buttonsCustom-50"
                          asChild
                        >
                          <Link href="/login/">Login</Link>
                        </Button>
                      )}
                      {pathname !== "/register/" && (
                        <Button
                          className="flex-1 rounded-full bg-gradient-to-r from-buttonsCustom-600 to-buttonsCustom-700 hover:from-buttonsCustom-700 hover:to-buttonsCustom-800"
                          asChild
                        >
                          <Link href="/register/">Register</Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full relative"
                        asChild
                      >
                        <Link href="/cart/">
                          <ShoppingCart className="h-5 w-5" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-buttonsCustom-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </Button>
                      <Button
                        className="rounded-full bg-buttonsCustom-800 hover:bg-buttonsCustom-900"
                        asChild
                      >
                        <Link href="/logout/">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default BaseHeader;