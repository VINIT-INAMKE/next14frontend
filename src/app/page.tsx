"use client";

import { useAuthStore } from "@/store/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import apiInstance from "@/utils/axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Globe,
  Rocket,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

interface Course {
  id: number;
  category: {
    id: number;
    title: string;
    image: string;
    active: boolean;
    slug: string;
  };
  teacher: {
    id: number;
    image: string;
    full_name: string;
    bio: string | null;
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    about: string;
    country: string | null;
    user: {
      id: number;
      password: string;
      last_login: string;
      is_superuser: boolean;
      first_name: string;
      last_name: string;
      is_staff: boolean;
      is_active: boolean;
      date_joined: string;
      username: string;
      email: string;
      full_name: string;
      otp: string | null;
      refresh_token: string | null;
    };
  };
  file: string | null;
  image: string | null;
  title: string;
  description: string;
  price: string;
  language: string;
  level: string;
  platform_status: string;
  teacher_course_status: string;
  featured: boolean;
  course_id: string;
  slug: string;
  date: string;
  students: {
    id: number;
  }[];
  average_rating: number | null;
  rating_count: number;
  reviews: {
    id: number;
  }[];
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const fetchCourse = async () => {
    setIsLoading(true);
    try {
      await apiInstance.get(`/course/course-list/`).then((res) => {
        setCourses(res.data);
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  if (!isLoggedIn()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-buttonsCustom-800 to-buttonsCustom-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-buttonsCustom-100 text-buttonsCustom-900 hover:bg-buttonsCustom-200"
            >
              <Zap className="h-4 w-4 mr-2" />
              Blockchain-Powered Learning
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Master Web3 Technologies with Decentralized Education
            </h1>
            <p className="text-lg md:text-xl text-buttonsCustom-100 mb-8">
              Earn verifiable credentials stored on blockchain while learning
              smart contracts, DeFi, and NFT development
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-buttonsCustom-800 px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              onClick={() => router.push("/courses")}
            >
              Explore Courses
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: <ShieldCheck className="h-8 w-8 text-buttonsCustom-600" />,
              title: "Immutable Certificates",
              description: "All course completions recorded on blockchain for permanent verification"
            },
            {
              icon: <Users className="h-8 w-8 text-buttonsCustom-600" />,
              title: "Expert Instructors",
              description: "Learn from active Web3 developers and blockchain architects"
            },
            {
              icon: <Globe className="h-8 w-8 text-buttonsCustom-600" />,
              title: "Global Network",
              description: "Join 150k+ developers in our decentralized learning community"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-all"
            >
              <div className="bg-buttonsCustom-50 w-fit p-3 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-buttonsCustom-900">{feature.title}</h3>
              <p className="text-buttonsCustom-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Categories Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Popular Blockchain Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Smart Contracts', icon: <Rocket className="h-6 w-6 text-buttonsCustom-600" /> },
              { name: 'DeFi Protocols', icon: <BookOpen className="h-6 w-6 text-buttonsCustom-600" /> },
              { name: 'NFT Development', icon: <GraduationCap className="h-6 w-6 text-buttonsCustom-600" /> },
              { name: 'DAOs', icon: <Users className="h-6 w-6 text-buttonsCustom-600" /> }
            ].map((category) => (
              <motion.div 
                key={category.name}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer border border-buttonsCustom-100"
                onClick={() => router.push(`/courses?category=${category.name.toLowerCase()}`)}
              >
                <div className="bg-buttonsCustom-50 w-fit p-3 rounded-lg mb-3">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-1 text-buttonsCustom-900">{category.name}</h3>
                <p className="text-sm text-buttonsCustom-700">12+ Courses</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Courses Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-white">
            Featured Courses
          </h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buttonsCustom-600"></div>
            </div>
          ) : (
            <>
              {/* Mobile view - Stack courses vertically */}
              <div className="md:hidden space-y-4">
                {courses.map((course) => (
                  <motion.div
                    key={course.course_id}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 bg-white/90 backdrop-blur-sm border border-white/20">
                      <div
                        className="relative aspect-video cursor-pointer"
                        onClick={() =>
                          router.push(`/course-details/${course.slug}`)
                        }
                      >
                        <Image
                          src={course.image || "/placeholder-course.jpg"}
                          alt={course.title}
                          fill
                          className="object-cover rounded-t-lg"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize bg-buttonsCustom-100 text-buttonsCustom-800">
                            {course.level}
                          </Badge>
                          <span className="text-sm font-semibold text-buttonsCustom-900">
                            ₹{course.price}
                          </span>
                        </div>
                        <CardTitle className="text-lg sm:text-xl text-buttonsCustom-900">
                          {course.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-buttonsCustom-700">
                          <span>{course.language}</span>
                          <span>•</span>
                          <span>{course.students.length} students</span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={course.teacher.image}
                              alt={course.teacher.full_name}
                            />
                            <AvatarFallback>
                              {course.teacher.full_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-buttonsCustom-800">
                            {course.teacher.full_name}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Rater total={5} rating={course.average_rating || 0} />
                            <span className="text-sm font-medium text-buttonsCustom-800">
                              ({course.rating_count} reviews)
                            </span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Desktop view - Carousel */}
              <div className="hidden md:block">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                    slidesToScroll: "auto",
                    containScroll: "trimSnaps",
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {courses.map((course) => (
                      <CarouselItem
                        key={course.course_id}
                        className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <motion.div whileHover={{ y: -5 }}>
                          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 bg-white/90 backdrop-blur-sm border border-white/20">
                            <div
                              className="relative aspect-video cursor-pointer"
                              onClick={() =>
                                router.push(`/course-details/${course.slug}`)
                              }
                            >
                              <Image
                                src={course.image || "/placeholder-course.jpg"}
                                alt={course.title}
                                fill
                                className="object-cover rounded-t-lg"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>
                            <CardHeader>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                                <Badge variant="secondary" className="capitalize bg-buttonsCustom-100 text-buttonsCustom-800">
                                  {course.level}
                                </Badge>
                                <span className="text-sm font-semibold text-buttonsCustom-900">
                                  ₹{course.price}
                                </span>
                              </div>
                              <CardTitle className="text-lg sm:text-xl text-buttonsCustom-900">
                                {course.title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-buttonsCustom-700">
                                <span>{course.language}</span>
                                <span>•</span>
                                <span>{course.students.length} students</span>
                              </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={course.teacher.image}
                                    alt={course.teacher.full_name}
                                  />
                                  <AvatarFallback>
                                    {course.teacher.full_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-buttonsCustom-800">
                                  {course.teacher.full_name}
                                </span>
                              </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Rater
                                    total={5}
                                    rating={course.average_rating || 0}
                                  />
                                  <span className="text-sm font-medium text-buttonsCustom-800">
                                    ({course.rating_count} reviews)
                                  </span>
                                </div>
                              </div>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-buttonsCustom-800" />
                  <CarouselNext className="text-buttonsCustom-800" />
                </Carousel>
              </div>
            </>
          )}
        </motion.div>

        {/* Learning Paths Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-buttonsCustom-50/20 backdrop-blur-sm rounded-xl shadow-sm p-8 mb-16 border border-buttonsCustom-200/30"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">Structured Learning Paths</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Blockchain Developer Track",
                description: "Master Solidity, Smart Contract Security, and DApp Deployment",
                icon: <BookOpen className="h-4 w-4 mr-2 text-buttonsCustom-600" />,
                details: "8 Courses • 72 Hours"
              },
              {
                title: "Web3 Specialist Track",
                description: "Learn NFT Standards, DAO Governance, and DeFi Protocols",
                icon: <GraduationCap className="h-4 w-4 mr-2 text-buttonsCustom-600" />,
                details: "6 Courses • 54 Hours"
              }
            ].map((path, index) => (
              <motion.div 
                key={index}
                whileHover={{ x: 5 }}
                className="border-l-4 border-buttonsCustom-700 pl-4"
              >
                <h3 className="text-xl font-semibold mb-2 text-white">{path.title}</h3>
                <p className="text-buttonsCustom-100 mb-4">{path.description}</p>
                <div className="flex items-center text-sm text-buttonsCustom-300">
                  {path.icon}
                  <span>{path.details}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}