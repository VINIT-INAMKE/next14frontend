"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  ArrowRight,
  Languages,
  BarChart3,
  Star,
  Calendar,
  BookOpenCheck,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";

import StudentHeader from "@/components/student/Header";
import StudentSidebar from "@/components/student/Sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";

interface CompletedLesson {
  id: number;
  lecture_id: number;
}

interface Course {
  enrollment_id: string;
  id: number;
  course: {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    file?: string;
    category: { title: string };
    average_rating?: number;
    level: string;
    language: string;
    teacher: {
      image: string;
      full_name: string;
      bio: string;
      twitter: string;
      facebook: string;
      linkedin: string;
      about: string;
    };
  };
  date: string;
  completed_lesson: CompletedLesson[];
  curriculum: {
    variant_id: number;
    title: string;
    content_duration: string;
    variant_items: {
      title: string;
      preview: boolean;
      duration: string;
    }[];
  }[];
}

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await useAxios.get(
        `student/course-list/${UserData()?.user_id}/`
      );
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
    };

    useEffect(() => {
        fetchData();
    }, []);

  const filterCourses = (query: string) => {
        if (query === "") {
      setFilteredCourses(courses);
        } else {
      const filtered = courses.filter((course) =>
        course.course.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterCourses(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
                    <StudentHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
                        <StudentSidebar />

          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-buttonsCustom-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl text-buttonsCustom-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-buttonsCustom-600" />
                        My Courses
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Start watching courses now from your dashboard page.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search Your Courses"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 border-buttonsCustom-200 focus:border-buttonsCustom-500"
                      />
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-buttonsCustom-600 border-t-transparent" />
                      </div>
                    ) : (
                      <div className="rounded-md border border-buttonsCustom-200">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-buttonsCustom-50">
                              <TableHead>Course Details</TableHead>
                              <TableHead>Enrollment Date</TableHead>
                              <TableHead>Progress</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCourses.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={5}
                                  className="text-center py-8 text-gray-500"
                                >
                                  No courses found
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredCourses.map((course, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div className="flex items-center gap-4">
                                      <div className="relative h-16 w-24 overflow-hidden rounded-lg">
                                        <Image
                                          src={course.course.image}
                                          alt={course.course.title}
                                          fill
                                          className="object-cover"
                                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="font-medium text-buttonsCustom-900">
                                          {course.course.title}
                            </h4>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                          <span className="flex items-center gap-1.5">
                                            <Languages className="h-4 w-4 text-buttonsCustom-600" />
                                            {course.course.language}
                                          </span>
                                          <span className="flex items-center gap-1.5">
                                            <BarChart3 className="h-4 w-4 text-buttonsCustom-600" />
                                            {course.course.level}
                                          </span>
                                          <span className="flex items-center gap-1.5">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            {(course.course.average_rating || 0).toFixed(1)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                      <Calendar className="h-4 w-4 text-buttonsCustom-600" />
                                      {moment(course.date).format("D MMM, YYYY")}
                                            </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                      <BookOpen className="h-4 w-4 text-buttonsCustom-600" />
                                      {course.curriculum.reduce(
                                        (total, section) =>
                                          total + section.variant_items.length,
                                        0
                                      )} Lectures
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1.5 text-gray-600">
                                      <BookOpenCheck className="h-4 w-4 text-green-500" />
                                      {course.completed_lesson.length} Completed
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant={
                                        course.completed_lesson.length > 0
                                          ? "default"
                                          : "secondary"
                                      }
                                      size="sm"
                                      className="flex items-center gap-2"
                                      onClick={() =>
                                        router.push(
                                          `/student/course/${course.enrollment_id}`
                                        )
                                      }
                                    >
                                      {course.completed_lesson.length > 0
                                        ? "Continue"
                                        : "Start"}{" "}
                                      Course
                                      <ArrowRight className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
                        </div>
                    </div>
                </div>
    );
}
