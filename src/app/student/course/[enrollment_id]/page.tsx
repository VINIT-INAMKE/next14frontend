"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";
import moment from "moment";
import { motion } from "framer-motion";
import {
  Play,
  PenSquare,
  Trash2,
  Search,
  Send,
  MessageSquare,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Pause,
  BookOpen,
  FileText,
  MessageCircle,
  Star,
  File,
  Download,
} from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";
import Toast from "@/views/plugins/Toast";

interface VariantItem {
  id: number;
  title: string;
  file: string;
  duration: string;
}

interface Note {
  id: number;
  title: string;
  note: string;
}

interface CompletedLesson {
  id: number;
  user: number;
  course: number;
  variant_item: {
    variant_item_id: number;
    id: number;
  };
}

interface Question {
  id: number;
  title: string;
  message: string;
  user: number;
  course: number;
  created_at: string;
  qa_id: number;
  profile: {
    full_name: string;
  };
  messages: {
    date: string;
    message: string;
    profile: {
      full_name: string;
    };
  }[];
  date: string;
}

interface Review {
  id: number;
  rating: number;
  review: string;
  user: number;
  course: number;
}

interface Course {
  course: {
    id: number;
    title: string;
    description: string;
    instructor: {
      id: number;
      name: string;
      avatar: string;
    };
  };
  lectures: VariantItem[];
  completed_lesson: CompletedLesson[];
  question_answer: Question[];
  review: Review;
  note: Note[];
  curriculum: {
    variant_id: number;
    title: string;
    content_duration: string;
    variant_items: {
      id: number;
      title: string;
      preview: boolean;
      duration: string;
      file: string;
      variant_item_id: string;
    }[];
  }[];
}

// Helper function to determine file type
const getFileType = (url: string): "video" | "pdf" | "document" | "other" => {
  const extension = url.split(".").pop()?.toLowerCase();

  if (["mp4", "webm", "ogg", "mov", ".avi", ".mkv"].includes(extension || "")) {
    return "video";
  } else if (extension === "pdf") {
    return "pdf";
  } else if (
    ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt"].includes(
      extension || ""
    )
  ) {
    return "document";
  }

  return "other";
};

export default function CourseDetail() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [variantItem, setVariantItem] = useState<VariantItem | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [markAsCompletedStatus, setMarkAsCompletedStatus] = useState<
    Record<string, string>
  >({});
  const [createNote, setCreateNote] = useState({ title: "", note: "" });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [createMessage, setCreateMessage] = useState({
    title: "",
    message: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Question | null>(null);
  const [createReview, setCreateReview] = useState({ rating: 1, review: "" });
  const [studentReview, setStudentReview] = useState<Review | null>(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isConversationModalOpen, setIsConversationModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const lastElementRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Add effect to stop video when modal closes
  useEffect(() => {
    if (!isLectureModalOpen) {
      setIsPlaying(false);
    }
  }, [isLectureModalOpen]);

  const fetchCourseDetail = useCallback(async () => {
    try {
      const response = await useAxios.get(
        `student/course-detail/${UserData()?.user_id}/${params.enrollment_id}/`
      );
      setCourse(response.data);
      setQuestions(response.data.question_answer);
      setStudentReview(response.data.review);

      // Log the structure of completed lessons to understand the expected format
      console.log(
        "Completed lessons structure:",
        response.data.completed_lesson
      );

      const percentageCompleted =
        (response.data.completed_lesson?.length /
          response.data.lectures?.length) *
        100;
      setCompletionPercentage(Number(percentageCompleted?.toFixed(0)));
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }, [params.enrollment_id]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleMarkLessonAsCompleted = async (variantItemId: number) => {
    const key = `lecture_${variantItemId}`;
    setMarkAsCompletedStatus({
      ...markAsCompletedStatus,
      [key]: "Updating",
    });

    // Find the corresponding variant item to get the correct variant_item_id string
    const foundVariantItem = course?.curriculum
      ?.flatMap((section) =>
        section.variant_items?.filter((item) => item.id === variantItemId)
      )
      .find(Boolean);

    // Check if lesson is already completed (for UI feedback only)
    const isAlreadyCompleted = course?.completed_lesson?.some(
      (lesson) => lesson.variant_item.id === variantItemId
    );

    // Create request data with the exact fields the backend expects
    const requestData = {
      user_id: UserData()?.user_id,
      course_id: course?.course?.id,
      variant_item_id: foundVariantItem?.variant_item_id,
    };

    try {
      await useAxios.post(`student/course-completed/`, requestData);

      fetchCourseDetail();
      setMarkAsCompletedStatus({
        ...markAsCompletedStatus,
        [key]: "Updated",
      });

      // Show appropriate toast based on the previous state
      if (isAlreadyCompleted) {
        Toast().fire({
          icon: "info",
          title: "Lesson marked as not completed",
        });
      } else {
        Toast().fire({
          icon: "success",
          title: "Lesson marked as completed",
        });
      }
    } catch {
      Toast().fire({
        icon: "error",
        title: "Failed to update lesson status",
        text: "Please try again later or contact support.",
      });
    }
  };

  const handleNoteChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateNote({
      ...createNote,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("user_id", String(UserData()?.user_id || 0));
    formdata.append("enrollment_id", String(params.enrollment_id));
    formdata.append("title", (createNote.title || "") as string);
    formdata.append("note", (createNote.note || "") as string);

    try {
      await useAxios.post(
        `student/course-note/${UserData()?.user_id}/${params.enrollment_id}/`,
        formdata
      );
      fetchCourseDetail();
      setIsNoteModalOpen(false);
      Toast().fire({
        icon: "success",
        title: "Note created",
      });
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleSubmitEditNote = async (e: React.FormEvent, noteId: number) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("user_id", String(UserData()?.user_id || 0));
    formdata.append("enrollment_id", String(params.enrollment_id));
    formdata.append(
      "title",
      (createNote.title || selectedNote?.title || "") as string
    );
    formdata.append(
      "note",
      (createNote.note || selectedNote?.note || "") as string
    );

    try {
      await useAxios.patch(
        `student/course-note-detail/${UserData()?.user_id}/${
          params.enrollment_id
        }/${noteId}/`,
        formdata
      );
      fetchCourseDetail();
      setIsNoteModalOpen(false);
      Toast().fire({
        icon: "success",
        title: "Note updated",
      });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await useAxios.delete(
        `student/course-note-detail/${UserData()?.user_id}/${
          params.enrollment_id
        }/${noteId}/`
      );
      fetchCourseDetail();
      Toast().fire({
        icon: "success",
        title: "Note deleted",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateMessage({
      ...createMessage,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("course_id", String(course?.course?.id || 0));
    formdata.append("user_id", String(UserData()?.user_id || 0));
    formdata.append("title", (createMessage.title || "") as string);
    formdata.append("message", (createMessage.message || "") as string);

    try {
      await useAxios.post(
        `student/question-answer-list-create/${course?.course?.id}/`,
        formdata
      );
      fetchCourseDetail();
      setIsQuestionModalOpen(false);
      Toast().fire({
        icon: "success",
        title: "Question sent",
      });
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const sendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("course_id", String(course?.course?.id || 0));
    formdata.append("user_id", String(UserData()?.user_id || 0));
    formdata.append("message", (createMessage.message || "") as string);
    formdata.append("qa_id", String(selectedConversation?.qa_id || 0));

    try {
      const response = await useAxios.post(
        `student/question-answer-message-create/`,
        formdata
      );
      setSelectedConversation(response.data.question);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation]);

  const handleSearchQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    if (query === "") {
      fetchCourseDetail();
    } else {
      const filtered = questions?.filter((question) =>
        question.title.toLowerCase().includes(query)
      );
      setQuestions(filtered);
    }
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreateReview({
      ...createReview,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("course_id", String(course?.course?.id || 0));
    formdata.append("user_id", String(UserData()?.user_id || 0));
    formdata.append("rating", String(createReview.rating));
    formdata.append("review", createReview.review);

    try {
      await useAxios.post(`student/rate-course/`, formdata);
      fetchCourseDetail();
      Toast().fire({
        icon: "success",
        title: "Review created",
      });
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  const handleUpdateReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("course", String(course?.course?.id || 0));
    formdata.append("user", String(UserData()?.user_id || 0));
    formdata.append(
      "rating",
      String(createReview?.rating || studentReview?.rating || "")
    );
    formdata.append(
      "review",
      String(createReview?.review || studentReview?.review || "")
    );

    try {
      await useAxios.patch(
        `student/review-detail/${UserData()?.user_id}/${studentReview?.id}/`,
        formdata
      );
      fetchCourseDetail();
      Toast().fire({
        icon: "success",
        title: "Review updated",
      });
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    playerRef.current?.seekTo(pos);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const toggleFullscreen = () => {
    const videoContainer = document.querySelector(".video-container");
    if (!videoContainer) return;

    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const formatDuration = (duration: string) => {
    if (!duration) return "0m 0s";
    const parts = duration.split(":");
    if (parts.length === 2) {
      return `${parts[0]}m ${parts[1]}s`;
    } else if (parts.length === 3) {
      return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
    }
    return duration;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <StudentHeader />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
          <div className="lg:sticky lg:top-4 lg:self-start">
            <StudentSidebar />
          </div>

          <div className="lg:col-span-3 space-y-5 sm:space-y-7">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="h-10 w-10 rounded-full bg-buttonsCustom-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-buttonsCustom-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  Course Content
                </h4>
                <p className="text-sm text-gray-500">{course?.course?.title}</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-buttonsCustom-200 overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl">
                {/* Gradient Header */}
                <div className="h-2 bg-gradient-to-r from-buttonsCustom-800 to-buttonsCustom-600" />
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-buttonsCustom-50/50 to-transparent border-b border-buttonsCustom-100">
                  <CardTitle className="text-lg sm:text-xl text-buttonsCustom-900">
                    {course?.course?.title}
                  </CardTitle>
                  <CardDescription className="mt-1 sm:mt-2 line-clamp-3 text-sm sm:text-base text-buttonsCustom-500">
                    {course?.course?.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <Tabs defaultValue="lectures" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                      <TabsTrigger
                        value="lectures"
                        className="text-xs sm:text-sm"
                      >
                        Course Lectures
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="text-xs sm:text-sm">
                        Notes
                      </TabsTrigger>
                      <TabsTrigger
                        value="discussion"
                        className="text-xs sm:text-sm"
                      >
                        Q/A
                      </TabsTrigger>
                      <TabsTrigger
                        value="review"
                        className="text-xs sm:text-sm"
                      >
                        Leave a Review
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="lectures" className="mt-4 sm:mt-6">
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <Progress
                            value={completionPercentage}
                            className="h-2 bg-gray-100"
                          />
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {completionPercentage}% Complete
                          </p>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                          {course?.curriculum?.map(
                            (section: Course["curriculum"][0]) => (
                              <AccordionItem
                                key={section.variant_id}
                                value={section.variant_id.toString()}
                                className="border-buttonsCustom-200"
                              >
                                <AccordionTrigger className="text-sm sm:text-base font-medium py-3 px-4 hover:bg-buttonsCustom-50">
                                  <div className="flex items-center">
                                    <span>{section.title}</span>
                                    <span className="text-xs sm:text-sm text-gray-500 ml-2">
                                      ({section.variant_items?.length} Lectures)
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="py-0">
                                  <div className="space-y-1 divide-y divide-buttonsCustom-100">
                                    {section.variant_items?.map(
                                      (
                                        lecture: Course["curriculum"][0]["variant_items"][0]
                                      ) => (
                                        <div
                                          key={lecture.id}
                                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                                        >
                                          <div className="flex items-center gap-2 sm:gap-4">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 text-buttonsCustom-600"
                                              onClick={() => {
                                                setVariantItem(lecture);
                                                setIsLectureModalOpen(true);
                                              }}
                                            >
                                              <Play className="h-4 w-4" />
                                            </Button>
                                            <span className="text-sm sm:text-base font-medium">
                                              {lecture.title}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                                            <span className="text-xs sm:text-sm text-gray-500">
                                              {formatDuration(
                                                lecture.duration || "0:0"
                                              )}
                                            </span>
                                            <div className="flex items-center">
                                              <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-buttonsCustom-600"
                                                checked={course.completed_lesson?.some(
                                                  (cl) => cl.variant_item.id === lecture.id
                                                )}
                                                onChange={() =>
                                                  handleMarkLessonAsCompleted(
                                                    lecture.id
                                                  )
                                                }
                                              />
                                            </div>
                                            <span className="ml-2 text-xs text-buttonsCustom-500">
                                              {course.completed_lesson?.some(
                                                (cl) => cl.variant_item.id === lecture.id
                                              )
                                                ? "Completed"
                                                : ""}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )
                          )}
                        </Accordion>
                      </div>
                    </TabsContent>

                    <TabsContent value="notes" className="mt-4 sm:mt-6">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-buttonsCustom-600" />
                            <h3 className="text-base sm:text-lg font-medium">
                              My Study Notes
                            </h3>
                          </div>
                          <Dialog
                            open={isNoteModalOpen}
                            onOpenChange={setIsNoteModalOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="w-full sm:w-auto bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
                              >
                                <PenSquare className="h-4 w-4 mr-2" />
                                Add Note
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-base sm:text-lg">
                                  {selectedNote ? "Edit Note" : "Add New Note"}
                                </DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(
                                  e: React.FormEvent<HTMLFormElement>
                                ) =>
                                  selectedNote
                                    ? handleSubmitEditNote(e, selectedNote.id)
                                    : handleSubmitCreateNote(e)
                                }
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Note Title
                                  </label>
                                  <Input
                                    name="title"
                                    value={createNote.title}
                                    onChange={handleNoteChange}
                                    placeholder="Enter note title"
                                    className="border-gray-200 focus-visible:ring-buttonsCustom-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Note Content
                                  </label>
                                  <Textarea
                                    name="note"
                                    value={createNote.note}
                                    onChange={handleNoteChange}
                                    placeholder="Enter note content"
                                    rows={4}
                                    className="border-gray-200 focus-visible:ring-buttonsCustom-500 resize-none"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsNoteModalOpen(false)}
                                    className="border-buttonsCustom-200 text-buttonsCustom-700"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
                                  >
                                    Save Note
                                  </Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="grid gap-4">
                          {course?.note?.length === 0 ? (
                            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-md">
                              <FileText className="h-12 w-12 mx-auto text-gray-300" />
                              <h3 className="mt-4 text-lg font-medium text-gray-900">
                                No notes yet
                              </h3>
                              <p className="mt-2 text-sm text-gray-500">
                                Create your first note to keep track of
                                important points
                              </p>
                            </div>
                          ) : (
                            course?.note?.map((note) => (
                              <Card
                                key={note.id}
                                className="bg-white/90 border-buttonsCustom-200 overflow-hidden"
                              >
                                <CardContent className="p-4 sm:p-5">
                                  <h4 className="text-base sm:text-lg font-medium text-buttonsCustom-900 mb-2">
                                    {note.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">
                                    {note.note}
                                  </p>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-buttonsCustom-600 border-buttonsCustom-200"
                                      onClick={() => {
                                        setSelectedNote(note);
                                        setCreateNote({
                                          title: note.title,
                                          note: note.note,
                                        });
                                        setIsNoteModalOpen(true);
                                      }}
                                    >
                                      <PenSquare className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleDeleteNote(note.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="discussion" className="mt-4 sm:mt-6">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-buttonsCustom-600" />
                            <h3 className="text-base sm:text-lg font-medium">
                              Questions & Answers
                            </h3>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-buttonsCustom-400" />
                              <Input
                                type="search"
                                placeholder="Search questions"
                                onChange={handleSearchQuestion}
                                className="pl-10 border-buttonsCustom-200 focus:border-buttonsCustom-500"
                              />
                            </div>
                            <Dialog
                              open={isQuestionModalOpen}
                              onOpenChange={setIsQuestionModalOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="w-full sm:w-auto bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Ask Question
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-base sm:text-lg">
                                    Ask a Question
                                  </DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={handleSaveQuestion}
                                  className="space-y-4"
                                >
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                      Question Title
                                    </label>
                                    <Input
                                      name="title"
                                      value={createMessage.title}
                                      onChange={handleMessageChange}
                                      placeholder="Enter question title"
                                      className="border-gray-200 focus-visible:ring-buttonsCustom-500"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                      Question Details
                                    </label>
                                    <Textarea
                                      name="message"
                                      value={createMessage.message}
                                      onChange={handleMessageChange}
                                      placeholder="Enter your question"
                                      rows={4}
                                      className="border-gray-200 focus-visible:ring-buttonsCustom-500 resize-none"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setIsQuestionModalOpen(false)
                                      }
                                      className="border-buttonsCustom-200 text-buttonsCustom-700"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      size="sm"
                                      className="bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
                                    >
                                      Send Question
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          {questions?.length === 0 ? (
                            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-md">
                              <MessageCircle className="h-12 w-12 mx-auto text-gray-300" />
                              <h3 className="mt-4 text-lg font-medium text-gray-900">
                                No questions yet
                              </h3>
                              <p className="mt-2 text-sm text-gray-500">
                                Ask your first question to get help from
                                instructors
                              </p>
                            </div>
                          ) : (
                            questions?.map((question) => (
                              <motion.div
                                key={question.qa_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Card className="bg-white/90 border-buttonsCustom-200 overflow-hidden hover:shadow-md transition-shadow">
                                  <CardContent className="p-4 sm:p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="h-8 w-8 rounded-full bg-buttonsCustom-100 flex items-center justify-center text-buttonsCustom-600">
                                        {question.profile.full_name
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {question.profile.full_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {moment(question.date).format(
                                            "MMM DD, YYYY"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    <h4 className="text-base font-medium text-buttonsCustom-900 mb-3">
                                      {question.title}
                                    </h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-buttonsCustom-600 border-buttonsCustom-200"
                                      onClick={() => {
                                        setSelectedConversation(question);
                                        setIsConversationModalOpen(true);
                                        setCreateMessage({
                                          title: "",
                                          message: "",
                                        });
                                      }}
                                    >
                                      Join Conversation
                                      <MessageSquare className="h-4 w-4 ml-2" />
                                    </Button>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="review" className="mt-4 sm:mt-6">
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Star className="h-5 w-5 text-buttonsCustom-600" />
                          <h3 className="text-base sm:text-lg font-medium">
                            Rate This Course
                          </h3>
                        </div>

                        <Card className="bg-white/90 border-buttonsCustom-200 overflow-hidden">
                          <CardContent className="p-4 sm:p-6">
                            {!studentReview ? (
                              <form
                                onSubmit={handleCreateReviewSubmit}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Rating
                                  </label>
                                  <Select
                                    name="rating"
                                    value={createReview.rating.toString()}
                                    onValueChange={(value) =>
                                      setCreateReview({
                                        ...createReview,
                                        rating: parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger className="border-gray-200 focus:ring-buttonsCustom-500">
                                      <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">
                                        ★☆☆☆☆ (1/5)
                                      </SelectItem>
                                      <SelectItem value="2">
                                        ★★☆☆☆ (2/5)
                                      </SelectItem>
                                      <SelectItem value="3">
                                        ★★★☆☆ (3/5)
                                      </SelectItem>
                                      <SelectItem value="4">
                                        ★★★★☆ (4/5)
                                      </SelectItem>
                                      <SelectItem value="5">
                                        ★★★★★ (5/5)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Review
                                  </label>
                                  <Textarea
                                    name="review"
                                    value={createReview.review}
                                    onChange={handleReviewChange}
                                    placeholder="Share your experience with this course..."
                                    rows={4}
                                    className="border-gray-200 focus-visible:ring-buttonsCustom-500 resize-none"
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
                                >
                                  Submit Review
                                </Button>
                              </form>
                            ) : (
                              <form
                                onSubmit={handleUpdateReviewSubmit}
                                className="space-y-4"
                              >
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Rating
                                  </label>
                                  <Select
                                    name="rating"
                                    value={studentReview.rating.toString()}
                                    onValueChange={(value) =>
                                      setCreateReview({
                                        ...createReview,
                                        rating: parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger className="border-gray-200 focus:ring-buttonsCustom-500">
                                      <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">
                                        ★☆☆☆☆ (1/5)
                                      </SelectItem>
                                      <SelectItem value="2">
                                        ★★☆☆☆ (2/5)
                                      </SelectItem>
                                      <SelectItem value="3">
                                        ★★★☆☆ (3/5)
                                      </SelectItem>
                                      <SelectItem value="4">
                                        ★★★★☆ (4/5)
                                      </SelectItem>
                                      <SelectItem value="5">
                                        ★★★★★ (5/5)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Review
                                  </label>
                                  <Textarea
                                    name="review"
                                    value={
                                      createReview.review ||
                                      studentReview.review
                                    }
                                    onChange={handleReviewChange}
                                    placeholder="Share your experience with this course..."
                                    rows={4}
                                    className="border-gray-200 focus-visible:ring-buttonsCustom-500 resize-none"
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  className="bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
                                >
                                  Update Review
                                </Button>
                              </form>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lecture Modal */}
      <Dialog open={isLectureModalOpen} onOpenChange={setIsLectureModalOpen}>
        <DialogContent className="max-w-3xl sm:max-w-4xl md:max-w-5xl p-0 overflow-hidden bg-black border border-buttonsCustom-500">
          <DialogHeader className="p-4 bg-buttonsCustom-500 border-b border-buttonsCustom-700">
            <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold text-white">
              {variantItem?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="relative bg-black rounded-lg overflow-hidden group video-container">
            {variantItem?.file && getFileType(variantItem.file) === "video" ? (
              <>
                <div
                  className="aspect-video cursor-pointer"
                  onClick={handlePlayPause}
                >
                  <ReactPlayer
                    ref={playerRef}
                    url={variantItem.file}
                    controls={false}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={isMuted ? 0 : volume}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={() => setIsPlaying(false)}
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                          style: { pointerEvents: "none" },
                        },
                      },
                    }}
                  />
                </div>
                {/* Custom Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1 sm:gap-2">
                    {/* Progress Bar */}
                    <div
                      className="w-full h-1.5 bg-gray-700 rounded-full cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-buttonsCustom-500 rounded-full"
                        style={{ width: `${played * 100}%` }}
                      />
                    </div>
                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-buttonsCustom-400"
                        >
                          <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-buttonsCustom-400"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-buttonsCustom-400"
                        >
                          <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-buttonsCustom-400"
                            onClick={handleMute}
                          >
                            {isMuted ? (
                              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </Button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 sm:w-20 h-1 bg-gray-600 rounded-full cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm text-white">
                          {formatTime(played * duration)} /{" "}
                          {formatTime(duration)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-buttonsCustom-400"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? (
                            <Minimize className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : variantItem?.file && getFileType(variantItem.file) === "pdf" ? (
              <div className="h-[60vh] flex items-center justify-center bg-gray-100">
                <iframe
                  src={`${variantItem.file}#toolbar=0`}
                  className="w-full h-full"
                  title={variantItem.title}
                />
              </div>
            ) : (
              <div className="h-[60vh] flex flex-col items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
                  <File className="h-16 w-16 text-buttonsCustom-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {variantItem?.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This file type cannot be previewed directly
                  </p>
                  <a
                    href={variantItem?.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-buttonsCustom-500 hover:bg-buttonsCustom-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-buttonsCustom-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-buttonsCustom-100">
                  {getFileType(variantItem?.file || "") === "video"
                    ? `Duration: ${formatDuration(variantItem?.duration || "")}`
                    : `File Type: ${getFileType(
                        variantItem?.file || ""
                      ).toUpperCase()}`}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleMarkLessonAsCompleted(variantItem?.id || 0)
                }
                className="w-full sm:w-auto bg-buttonsCustom-700 border-buttonsCustom-600 text-white hover:bg-buttonsCustom-700"
              >
                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                {course?.completed_lesson?.some(
                  (cl) => cl.variant_item.id === variantItem?.id
                )
                  ? "Mark as Not Complete"
                  : "Mark as Complete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conversation Modal */}
      <Dialog
        open={isConversationModalOpen}
        onOpenChange={setIsConversationModalOpen}
      >
        <DialogContent className="max-w-lg sm:max-w-xl md:max-w-2xl p-0 bg-white overflow-hidden border border-buttonsCustom-200">
          <DialogHeader className="p-4 bg-buttonsCustom-50 border-b border-buttonsCustom-100">
            <DialogTitle className="text-base sm:text-lg md:text-xl text-buttonsCustom-900">
              {selectedConversation?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="h-[300px] sm:h-[400px] overflow-y-auto space-y-3 pr-2">
              {selectedConversation?.messages?.map(
                (
                  message: {
                    date: string;
                    message: string;
                    profile: { full_name: string };
                  },
                  index: number
                ) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 bg-buttonsCustom-50 p-3 sm:p-4 rounded-lg border border-buttonsCustom-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-buttonsCustom-100 flex items-center justify-center text-buttonsCustom-600">
                          {message.profile.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {message.profile.full_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {moment(message.date).format(
                              "MMM DD, YYYY • h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {message.message}
                      </p>
                    </div>
                  </div>
                )
              )}
              <div ref={lastElementRef} />
            </div>
            <form
              onSubmit={sendNewMessage}
              className="flex gap-2 mt-4 border-t border-buttonsCustom-100 pt-4"
            >
              <Textarea
                name="message"
                value={createMessage.message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="flex-1 border-buttonsCustom-200 focus-visible:ring-buttonsCustom-500 resize-none"
                rows={2}
              />
              <Button
                type="submit"
                size="icon"
                className="h-auto bg-buttonsCustom-600 hover:bg-buttonsCustom-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
