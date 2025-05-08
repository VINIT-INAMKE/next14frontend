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
// import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// import { Star } from "lucide-react";
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
      // groups: any[];
      // user_permissions: any[];
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
  // curriculum: any[];
  // lectures: any[];
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
        console.log("Courses data:", res.data);
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
      <div className="bg-gradient-to-r from-buttonsCustom-700 to-buttonsCustom-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 bg-buttonsCustom-100 text-buttonsCustom-900"
            >
              <Zap className="h-4 w-4 mr-2" />
              Blockchain-Powered Learning
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Master Web3 Technologies with Decentralized Education
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Earn verifiable credentials stored on blockchain while learning
              smart contracts, DeFi, and NFT development
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-fit p-3 rounded-lg mb-4">
              <ShieldCheck className="h-8 w-8 text-buttonsCustom-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Immutable Certificates</h3>
            <p className="text-gray-600">All course completions recorded on blockchain for permanent verification</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-fit p-3 rounded-lg mb-4">
              <Users className="h-8 w-8 text-buttonsCustom-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">Learn from active Web3 developers and blockchain architects</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-fit p-3 rounded-lg mb-4">
              <Globe className="h-8 w-8 text-buttonsCustom-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Network</h3>
            <p className="text-gray-600">Join 150k+ developers in our decentralized learning community</p>
          </div>
        </div>
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Blockchain Topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Smart Contracts', icon: <Rocket /> },
              { name: 'DeFi Protocols', icon: <BookOpen /> },
              { name: 'NFT Development', icon: <GraduationCap /> },
              { name: 'DAOs', icon: <Users /> }
            ].map((category) => (
              <div 
                key={category.name}
                className="bg-white p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer border border-buttonsCustom-100"
                onClick={() => router.push(`/courses?category=${category.name.toLowerCase()}`)}
              >
                <div className="bg-buttonsCustom-100 w-fit p-3 rounded-lg mb-3">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">12+ Courses</p>
              </div>
            ))}
          </div>
        </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8">
          Featured Courses
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {/* Mobile view - Stack courses vertically */}
            <div className="md:hidden space-y-4">
              {courses.map((course) => (
                <Card
                  key={course.course_id}
                  className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200"
                >
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
                      <Badge variant="secondary" className="capitalize">
                        {course.level}
                      </Badge>
                      <span className="text-sm font-semibold">
                        &#8377; {course.price}
                      </span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl">
                      {course.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                      <span className="text-sm">
                        {course.teacher.full_name}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Rater total={5} rating={course.average_rating || 0} />
                        <span className="text-sm font-medium">
                          ({course.rating_count} reviews)
                        </span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Desktop view - Keep the carousel */}
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
                      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
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
                            <Badge variant="secondary" className="capitalize">
                              {course.level}
                            </Badge>
                            <span className="text-sm font-semibold">
                              &#8377; {course.price}
                            </span>
                          </div>
                          <CardTitle className="text-lg sm:text-xl">
                            {course.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                            <span className="text-sm">
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
                              <span className="text-sm font-medium">
                                ({course.rating_count} reviews)
                              </span>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </>
        )}
      </div>
      <div className="bg-primaryCustom-200 rounded-xl shadow-sm p-8 mb-16 border border-gray-100">
          <h2 className="text-3xl font-bold mb-8">Structured Learning Paths</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-l-4 border-buttonsCustom-900 pl-4">
              <h3 className="text-xl font-semibold mb-2">Blockchain Developer Track</h3>
              <p className="text-gray-600 mb-4">Master Solidity, Smart Contract Security, and DApp Deployment</p>
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>8 Courses • 72 Hours</span>
              </div>
            </div>
            <div className="border-l-4 border-buttonsCustom-900 pl-4">
              <h3 className="text-xl font-semibold mb-2">Web3 Specialist Track</h3>
              <p className="text-gray-600 mb-4">Learn NFT Standards, DAO Governance, and DeFi Protocols</p>
              <div className="flex items-center text-sm text-gray-500">
                <GraduationCap className="h-4 w-4 mr-2" />
                <span>6 Courses • 54 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
   
    </div>
  );
}
