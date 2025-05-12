"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Toast from "@/views/plugins/Toast";
import UserData from "@/views/plugins/UserData";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Layout Components
import InstructorSidebar from "@/components/instructor/Sidebar";
import InstructorHeader from "@/components/instructor/Header";

// Dynamic CKEditor
import DynamicCKEditorWrapper from "@/components/DynamicCKEditorWrapper";

// Icons
import { 
  ArrowLeft, 
  
  FileVideo, 
  GraduationCap,
  Languages,
  DollarSign,
  BookOpen,
  Save,
  BookOpenCheck
} from "lucide-react";

// API
import useAxios from "@/utils/axios";


// Types
interface CourseData {
  title?: string;
  description?: string;
  image?: string;
  file?: string;
  level?: string;
  language?: string;
  price?: string | number;
  category?: string | number | { id: number; title: string };
  category_id?: string | number;
  [key: string]: string | number | boolean | object | undefined;
}

interface Category {
  id: number;
  title: string;
}

export default function CourseEdit({ params }: { params: { course_id: string } }) {
  const [courseData, setCourseData] = useState<CourseData>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const [category, setCategory] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newImageUploaded, setNewImageUploaded] = useState<boolean>(false);
  const [newFileUploaded, setNewFileUploaded] = useState<boolean>(false);
  

  const courseId = params.course_id;

  useEffect(() => {
    // Fetch categories and course details
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories first
        try {
          const categoryResponse = await useAxios.get("course/category/");
          setCategory(categoryResponse.data);
        } catch (categoryError) {
          console.error("Error fetching categories:", categoryError);
          // Continue with course fetch even if categories fail
        }
        
        // Then fetch course details with timeout handling
        try {
          const courseResponse = await useAxios.get(`teacher/course-detail/${courseId}/`, {
            timeout: 15000 // Extend timeout to 15 seconds
          });
          setCourseData(courseResponse.data);
          setImagePreview(courseResponse.data?.image || "");
        } catch (error: unknown) {
          console.error("Error fetching course details:", error);
          
          const courseError = error as { 
            code?: string; 
            response?: { status?: number } 
          };
          
          if (courseError.code === "ECONNABORTED") {
            Toast().fire({
              icon: "error",
              title: "Server request timed out. Please try again later.",
            });
          } else if (courseError.response?.status === 500) {
            Toast().fire({
              icon: "error",
              title: "Course not found or server error.",
            });
          } else {
            Toast().fire({
              icon: "error",
              title: "Failed to load course data. Please try again.",
            });
          }
        }
        
      } catch (error) {
        console.error("Error in fetch operation:", error);
        Toast().fire({
          icon: "error",
          title: "Failed to load data. Please check your connection.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    setImagePreview("");
    setIsUploading(true);

    const file = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await useAxios.post("/file-upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // Increase timeout to 30 seconds for image uploads
      });

      if (response?.data?.url) {
        // Store the full URL for preview
        const fullUrl = response.data.url;
        setImagePreview(fullUrl);
        
        // Extract just the filename part for the API
        const extractedFilename = extractFilenameFromUrl(fullUrl);
        
        setIsUploading(false);
        setCourseData({
          ...courseData,
          image: extractedFilename,
        });
        setNewImageUploaded(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      Toast().fire({
        icon: "error",
        title: "Failed to upload image. Please try with a smaller file.",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setIsFileUploading(true);

    const file = event.target.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await useAxios.post("/file-upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // Increase timeout to 60 seconds for video uploads
      });

      if (response?.data?.url) {
        // Store the full URL for preview/player
        const fullUrl = response.data.url;
        
        // Extract just the filename part for the API
        const extractedFilename = extractFilenameFromUrl(fullUrl);
        
        setIsFileUploading(false);
        setCourseData({
          ...courseData,
          file: extractedFilename,
        });
        setNewFileUploaded(true);
      }
    } catch (error) {
      console.error("Error uploading course intro:", error);
      setIsFileUploading(false);
      Toast().fire({
        icon: "error",
        title: "Failed to upload video. The file might be too large or the server timed out.",
      });
    }
  };

  // Helper function to extract filename from URL
  const extractFilenameFromUrl = (url: string) => {
    // Remove base URL portion
    if (url.includes('/media/')) {
      // Extract the part after '/media/'
      const mediaPath = url.split('/media/')[1];
      return mediaPath;
    }
    return url;
  };

  const handleCourseInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCourseData({
      ...courseData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Get the teacher ID from the user data
      const userData = UserData();
      if (!userData || !userData.teacher_id) {
        Toast().fire({
          icon: "error",
          title: "Teacher ID not found. Please log in again.",
        });
        return;
      }
      
      // Validate required fields
      const requiredFields = ['title', 'description', 'category', 'level', 'language', 'price'];
      const missingFields = requiredFields.filter(field => !courseData[field]);
      
      if (missingFields.length > 0) {
        Toast().fire({
          icon: "warning",
          title: `Please fill in the following fields: ${missingFields.join(', ')}`,
        });
        return;
      }
      
      // Create URLSearchParams for form data (not FormData)
      const formData = new URLSearchParams();
      formData.append('title', courseData.title || '');
      
      // For description field, ensure HTML is properly formatted
      const description = courseData.description?.toString().trim() || '';
      formData.append('description', description);
      
      // Only include image and file if they are newly uploaded
      if (newImageUploaded && courseData.image) {
        formData.append('image_url', courseData.image.toString());
      }
      
      if (newFileUploaded && courseData.file) {
        formData.append('file_url', courseData.file.toString());
      }
      
      formData.append('level', courseData.level || '');
      formData.append('language', courseData.language || '');
      formData.append('price', courseData.price?.toString() || '');
      
      // Handle category value, which might be an object with an ID or a direct ID
      const categoryId = typeof courseData.category === 'object' && courseData.category !== null
        ? (courseData.category as { id: number }).id
        : courseData.category;
      
      formData.append('category', categoryId?.toString() || '');
      
      // Use the axios instance with proper headers
      await useAxios.put(`teacher/course-update/${userData.teacher_id}/${courseId}/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      Toast().fire({
        icon: "success",
        title: "Course Updated Successfully",
      });
      
      // Reset the upload flags
      setNewImageUploaded(false);
      setNewFileUploaded(false);
      
      // Refresh the data
      const updatedCourse = await useAxios.get(`teacher/course-detail/${courseId}/`);
      setCourseData(updatedCourse.data);
      
    } catch (error: unknown) {
      console.error("Error updating course:", error);
      
      // Enhanced error handling to show more specific error messages
      let errorMessage = "Please check your inputs and try again";
      
      // Type guard for Axios error objects
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error.response as { data?: unknown; status?: number };
        console.log("Error response data:", errorResponse.data);
        console.log("Error status:", errorResponse.status);
        
        // Extract error message from response if available
        if (errorResponse.data && 
            typeof errorResponse.data === 'object' && 
            errorResponse.data !== null) {
          
          // Process validation errors
          try {
            console.log("Error data:", JSON.stringify(errorResponse.data));
            const entries = Object.entries(errorResponse.data as Record<string, unknown>);
            const fieldErrors = entries
              .filter(([, value]) => value !== null && typeof value !== 'undefined')
              .map(([field, value]) => `${field}: ${String(value)}`)
              .join(', ');
            
            if (fieldErrors) {
              errorMessage = `Validation errors: ${fieldErrors}`;
              console.log("Field errors:", fieldErrors);
            }
          } catch (parseError) {
            console.error("Error parsing validation errors:", parseError);
          }
        }
      }
      
      const toastError = {
        message: errorMessage,
        error: error
      };
      console.log("Toast error details:", toastError);
      
      Toast().fire({
        icon: "error",
        title: `Failed to update course: ${errorMessage}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <InstructorHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
          <div className="lg:sticky lg:top-4 lg:self-start">
            <InstructorSidebar />
          </div>
          
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <motion.div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-buttonsCustom-100 flex items-center justify-center">
                <BookOpenCheck className="h-5 w-5 text-buttonsCustom-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Edit Course</h4>
                <p className="text-sm text-gray-500">Update your course information</p>
              </div>
            </motion.div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-buttonsCustom-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Card className="border-buttonsCustom-200 overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl mb-6">
                  {/* Gradient Header */}
                  <div className="h-2 bg-gradient-to-r from-buttonsCustom-800 to-buttonsCustom-600" />
                  <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-buttonsCustom-50/50 to-transparent border-b border-buttonsCustom-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg sm:text-xl text-buttonsCustom-900">Course Details</CardTitle>
                        <p className="text-sm text-buttonsCustom-500 mt-1">
                          Update your course information below
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="border-buttonsCustom-200 text-buttonsCustom-600 hover:bg-buttonsCustom-50 gap-2"
                        >
                          <Link href="/instructor/courses/">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Courses
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-buttonsCustom-200 text-green-600 hover:bg-green-50 gap-2"
                        >
                          <Link href={`/instructor/edit-course/${courseId}/curriculum/`}>
                            <BookOpen className="h-4 w-4" />
                            Manage Curriculum
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    {/* Thumbnail section */}
                    <div>
                      <Label htmlFor="courseThumbnail" className="mb-2 block font-medium">
                        Course Thumbnail
                      </Label>
                      <div className="mb-4">
                        <div className="relative aspect-video max-h-[330px] w-full overflow-hidden rounded-lg border bg-white/50 shadow-sm border-buttonsCustom-200/30 group">
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Course thumbnail preview"
                              fill
                              className="object-cover transition duration-300 group-hover:scale-[1.01]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-50">
                              <div className="text-center">
                                <BookOpen className="mx-auto h-12 w-12 text-buttonsCustom-200" />
                                <p className="mt-2 text-sm text-buttonsCustom-400">Thumbnail Preview</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          id="courseThumbnail"
                          type="file"
                          className="cursor-pointer file:cursor-pointer file:text-buttonsCustom-600 file:bg-buttonsCustom-50 file:border-buttonsCustom-200 file:rounded-md file:px-3 file:py-1.5 file:mr-3 file:border file:transition-colors file:hover:bg-buttonsCustom-100"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        {isUploading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-buttonsCustom-600"></div>
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload a high-quality image (16:9 ratio recommended) for your course thumbnail
                      </p>
                    </div>
                    
                    <Separator className="bg-buttonsCustom-100" />
                    
                    {/* Intro Video section */}
                    <div>
                      <Label htmlFor="introVideo" className="mb-2 block font-medium">
                        Course Intro Video
                      </Label>
                      <div className="relative">
                        <Input
                          id="introVideo"
                          type="file"
                          className="cursor-pointer file:cursor-pointer file:text-buttonsCustom-600 file:bg-buttonsCustom-50 file:border-buttonsCustom-200 file:rounded-md file:px-3 file:py-1.5 file:mr-3 file:border file:transition-colors file:hover:bg-buttonsCustom-100"
                          accept="video/*"
                          onChange={handleFileUpload}
                        />
                        {isFileUploading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-buttonsCustom-600"></div>
                          </div>
                        )}
                      </div>
                      {courseData.file && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-buttonsCustom-600">
                          <FileVideo className="h-4 w-4" />
                          <a 
                            href={courseData.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium"
                          >
                            Preview uploaded video
                          </a>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Add a short preview video to attract more students to your course
                      </p>
                    </div>
                    
                    <Separator className="bg-buttonsCustom-100" />
                    
                    {/* Title & Category section */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="courseTitle" className="font-medium">Course Title</Label>
                        <Input
                          id="courseTitle"
                          name="title"
                          placeholder="e.g., Mastering JavaScript for Beginners"
                          value={courseData.title || ""}
                          onChange={handleCourseInputChange}
                          className="border-buttonsCustom-200 focus:border-buttonsCustom-600 focus:ring-buttonsCustom-600/10"
                        />
                        <p className="text-xs text-gray-500">
                          Write a clear, concise title (max 60 characters)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category" className="font-medium">Course Category</Label>
                        <Select 
                          value={
                            typeof courseData.category === 'object' && courseData.category !== null
                              ? String((courseData.category as { id: number }).id)
                              : String(courseData.category || "")
                          }
                          onValueChange={(value) => handleSelectChange(value, "category")}
                        >
                          <SelectTrigger className="border-buttonsCustom-200 focus:ring-buttonsCustom-600/10">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="border-buttonsCustom-100">
                            {category.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Choose the most relevant category for your course
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-buttonsCustom-100" />
                    
                    {/* Level & Language section */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-medium">Course Level</Label>
                        <Select 
                          value={courseData.level || ""} 
                          onValueChange={(value) => handleSelectChange(value, "level")}
                        >
                          <SelectTrigger className="w-full border-buttonsCustom-200 focus:ring-buttonsCustom-600/10">
                            <SelectValue placeholder="Select course level" />
                          </SelectTrigger>
                          <SelectContent className="border-buttonsCustom-100">
                            <SelectItem value="Beginner">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-green-500" />
                                <span>Beginner</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Intermediate">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-yellow-500" />
                                <span>Intermediate</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Advanced">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-red-500" />
                                <span>Advanced</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">Course Language</Label>
                        <Select 
                          value={courseData.language || ""} 
                          onValueChange={(value) => handleSelectChange(value, "language")}
                        >
                          <SelectTrigger className="w-full border-buttonsCustom-200 focus:ring-buttonsCustom-600/10">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="border-buttonsCustom-100">
                            <SelectItem value="English">
                              <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-blue-500" />
                                <span>English</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Spanish">
                              <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-blue-500" />
                                <span>Spanish</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="French">
                              <div className="flex items-center gap-2">
                                <Languages className="h-4 w-4 text-blue-500" />
                                <span>French</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator className="bg-buttonsCustom-100" />
                    
                    {/* Description section */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="font-medium">Course Description</Label>
                      <div className="min-h-[200px] rounded-md border border-buttonsCustom-200 overflow-hidden shadow-sm hover:border-buttonsCustom-500 focus-within:border-buttonsCustom-600 focus-within:ring-2 focus-within:ring-buttonsCustom-600/20 transition-all duration-200">
                        <DynamicCKEditorWrapper
                          initialData={courseData.description || ""}
                          onChange={(data) => {
                            setCourseData({
                              ...courseData,
                              description: data,
                            });
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Provide a comprehensive description of what students will learn
                      </p>
                    </div>
                    
                    <Separator className="bg-buttonsCustom-100" />
                    
                    {/* Price section */}
                    <div className="max-w-xs space-y-2">
                      <Label htmlFor="price" className="font-medium">Course Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-buttonsCustom-400" />
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          name="price"
                          placeholder="29.99"
                          className="pl-9 border-buttonsCustom-200 focus:border-buttonsCustom-600 focus:ring-buttonsCustom-600/10"
                          value={courseData.price || ""}
                          onChange={handleCourseInputChange}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Set an appropriate price based on course length and content
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto float-right gap-2 bg-gradient-to-r from-buttonsCustom-600 to-buttonsCustom-800 hover:from-buttonsCustom-700 hover:to-buttonsCustom-900 shadow-md hover:shadow-lg transition-all duration-200 text-white"
                >
                  <Save className="h-5 w-5" />
                  Update Course
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
