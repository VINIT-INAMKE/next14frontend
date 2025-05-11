"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";
import moment from "moment";
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
    }[];
  }[];
}

export default function CourseDetail() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [variantItem, setVariantItem] = useState<VariantItem | null>(null);
    const [completionPercentage, setCompletionPercentage] = useState(0);
  const [markAsCompletedStatus, setMarkAsCompletedStatus] = useState<Record<string, string>>({});
    const [createNote, setCreateNote] = useState({ title: "", note: "" });
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [createMessage, setCreateMessage] = useState({
        title: "",
        message: "",
    });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Question | null>(null);
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
      const percentageCompleted = (response.data.completed_lesson?.length / response.data.lectures?.length) * 100;
      setCompletionPercentage(Number(percentageCompleted?.toFixed(0)));
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }, [params.enrollment_id]);

    useEffect(() => {
        fetchCourseDetail();
  }, [fetchCourseDetail]);

  const handleMarkLessonAsCompleted = async (variantItemId: number) => {
        const key = `lecture_${variantItemId}`;
        setMarkAsCompletedStatus({
            ...markAsCompletedStatus,
            [key]: "Updating",
        });

        const formdata = new FormData();
    formdata.append("user_id", String(UserData()?.user_id || 0));
    formdata.append("course_id", String(course?.course?.id || 0));
    formdata.append("variant_item_id", String(variantItemId));

    try {
      await useAxios.post(`student/course-completed/`, formdata);
            fetchCourseDetail();
            setMarkAsCompletedStatus({
                ...markAsCompletedStatus,
                [key]: "Updated",
            });
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
    }
    };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    formdata.append("title", (createNote.title || selectedNote?.title || "") as string);
    formdata.append("note", (createNote.note || selectedNote?.note || "") as string);

    try {
      await useAxios.patch(
        `student/course-note-detail/${UserData()?.user_id}/${params.enrollment_id}/${noteId}/`,
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
        `student/course-note-detail/${UserData()?.user_id}/${params.enrollment_id}/${noteId}/`
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

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    formdata.append("rating", String(createReview?.rating || studentReview?.rating || ""));
    formdata.append("review", String(createReview?.review || studentReview?.review || ""));

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
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const toggleFullscreen = () => {
    const videoContainer = document.querySelector('.video-container');
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

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatDuration = (duration: string) => {
    if (!duration) return "0m 0s";
    const parts = duration.split(':');
    if (parts.length === 2) {
      return `${parts[0]}m ${parts[1]}s`;
    } else if (parts.length === 3) {
      return `${parts[0]}h ${parts[1]}m ${parts[2]}s`;
    }
    return duration;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 md:py-6 lg:py-8">
                    <StudentHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 mt-2 sm:mt-4 md:mt-6 lg:mt-8">
                        <StudentSidebar />
          
          <div className="lg:col-span-3">
            <Card className="border-buttonsCustom-200">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-buttonsCustom-900">
                  {course?.course?.title}
                </CardTitle>
                <CardDescription className="mt-1 sm:mt-2 line-clamp-3 text-sm sm:text-base text-gray-600">
                  {course?.course?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <Tabs defaultValue="lectures" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                    <TabsTrigger value="lectures" className="text-xs sm:text-sm">Course Lectures</TabsTrigger>
                    <TabsTrigger value="notes" className="text-xs sm:text-sm">Notes</TabsTrigger>
                    <TabsTrigger value="discussion" className="text-xs sm:text-sm">Q/A</TabsTrigger>
                    <TabsTrigger value="review" className="text-xs sm:text-sm">Leave a Review</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lectures" className="mt-3 sm:mt-4">
                    <div className="space-y-3 sm:space-y-4">
                      <Progress value={completionPercentage} className="h-1.5 sm:h-2" />
                      <p className="text-xs sm:text-sm text-gray-500">
                        {completionPercentage}% Complete
                      </p>

                      <Accordion type="single" collapsible className="w-full">
                        {course?.curriculum?.map((section: Course['curriculum'][0]) => (
                          <AccordionItem key={section.variant_id} value={section.variant_id.toString()}>
                            <AccordionTrigger className="text-sm sm:text-base md:text-lg font-medium">
                              {section.title}
                              <span className="text-xs sm:text-sm text-gray-500 ml-2">
                                ({section.variant_items?.length} Lectures)
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 sm:space-y-3">
                                {section.variant_items?.map((lecture: Course['curriculum'][0]['variant_items'][0]) => (
                                  <div
                                    key={lecture.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4"
                                  >
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 sm:h-10 sm:w-10"
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
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <span className="text-xs sm:text-sm text-gray-500">
                                        {lecture.duration || "0m 0s"}
                                      </span>
                                                                                                <input
                                                                                                    type="checkbox"
                                        className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300"
                                        checked={course.completed_lesson?.some(
                                          (cl) => cl.variant_item.id === lecture.id
                                        )}
                                        onChange={() =>
                                          handleMarkLessonAsCompleted(lecture.id)
                                        }
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                ))}
                                                                            </div>
                            </AccordionContent>
                          </AccordionItem>
                                                                ))}
                      </Accordion>
                                                            </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-3 sm:mt-4">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                        <h3 className="text-base sm:text-lg font-medium">All Notes</h3>
                        <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full sm:w-auto">
                              <PenSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                              Add Note
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">{selectedNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => selectedNote ? handleSubmitEditNote(e, selectedNote.id) : handleSubmitCreateNote(e)} className="space-y-3 sm:space-y-4">
                              <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-medium">
                                                                                                    Note Title
                                                                                                </label>
                                <Input
                                  name="title"
                                  value={createNote.title}
                                  onChange={handleNoteChange}
                                  placeholder="Enter note title"
                                  className="text-sm"
                                />
                                                                                            </div>
                              <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-medium">
                                                                                                    Note Content
                                                                                                </label>
                                <Textarea
                                  name="note"
                                  value={createNote.note}
                                  onChange={handleNoteChange}
                                  placeholder="Enter note content"
                                  rows={4}
                                  className="text-sm"
                                />
                                                                                            </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsNoteModalOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" size="sm">Save Note</Button>
                              </div>
                                                                                        </form>
                          </DialogContent>
                        </Dialog>
                                                                                    </div>

                      <div className="grid gap-2 sm:gap-3 md:gap-4">
                        {course?.note?.map((note) => (
                          <Card key={note.id}>
                            <CardContent className="p-3 sm:p-4">
                              <h4 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">{note.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{note.note}</p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs sm:text-sm"
                                  onClick={() => {
                                    setSelectedNote(note);
                                    setCreateNote({ title: note.title, note: note.note });
                                    setIsNoteModalOpen(true);
                                  }}
                                >
                                  <PenSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="text-xs sm:text-sm"
                                  onClick={() => handleDeleteNote(note.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                  Delete
                                </Button>
                                                                                </div>
                            </CardContent>
                          </Card>
                        ))}
                                                                            </div>
                                                                        </div>
                  </TabsContent>

                  <TabsContent value="discussion" className="mt-3 sm:mt-4">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-2 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              type="search"
                              placeholder="Search questions"
                              onChange={handleSearchQuestion}
                              className="pl-8 sm:pl-10 text-sm"
                            />
                                                                </div>
                                                            </div>
                        <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full sm:w-auto">
                              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                              Ask Question
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">Ask a Question</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSaveQuestion} className="space-y-3 sm:space-y-4">
                              <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-medium">
                                  Question Title
                                </label>
                                <Input
                                  name="title"
                                  value={createMessage.title}
                                  onChange={handleMessageChange}
                                  placeholder="Enter question title"
                                  className="text-sm"
                                />
                                                        </div>
                              <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-medium">
                                  Question Details
                                </label>
                                <Textarea
                                  name="message"
                                  value={createMessage.message}
                                  onChange={handleMessageChange}
                                  placeholder="Enter your question"
                                  rows={4}
                                  className="text-sm"
                                />
                                                                            </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsQuestionModalOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" size="sm">Send Question</Button>
                                                                        </div>
                                                                    </form>
                          </DialogContent>
                        </Dialog>
                                                                </div>

                      <div className="space-y-2 sm:space-y-3">
                        {questions?.map((question) => (
                          <Card key={question.qa_id}>
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200" />
                                <div>
                                  <p className="text-sm sm:text-base font-medium">
                                    {question.profile.full_name}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {moment(question.date).format("DD MMM, YYYY")}
                                  </p>
                                                                                        </div>
                                                                                    </div>
                              <h4 className="text-sm sm:text-base font-medium mb-2">{question.title}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs sm:text-sm"
                                onClick={() => {
                                  setSelectedConversation(question);
                                  setIsConversationModalOpen(true);
                                }}
                              >
                                Join Conversation
                                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                              </Button>
                            </CardContent>
                          </Card>
                                                                        ))}
                                                                    </div>
                                                                </div>
                  </TabsContent>

                  <TabsContent value="review" className="mt-3 sm:mt-4">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-medium">Leave a Review</h3>
                      {!studentReview ? (
                        <form onSubmit={handleCreateReviewSubmit} className="space-y-3 sm:space-y-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Rating</label>
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
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1" className="text-sm">★☆☆☆☆ (1/5)</SelectItem>
                                <SelectItem value="2" className="text-sm">★★☆☆☆ (2/5)</SelectItem>
                                <SelectItem value="3" className="text-sm">★★★☆☆ (3/5)</SelectItem>
                                <SelectItem value="4" className="text-sm">★★★★☆ (4/5)</SelectItem>
                                <SelectItem value="5" className="text-sm">★★★★★ (5/5)</SelectItem>
                              </SelectContent>
                            </Select>
                                                            </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Review</label>
                            <Textarea
                              name="review"
                              value={createReview.review}
                              onChange={handleReviewChange}
                              placeholder="Write your review"
                              rows={4}
                              className="text-sm"
                            />
                                                        </div>
                          <Button type="submit" size="sm">Post Review</Button>
                                                                            </form>
                      ) : (
                        <form onSubmit={handleUpdateReviewSubmit} className="space-y-3 sm:space-y-4">
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Rating</label>
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
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Select rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1" className="text-sm">★☆☆☆☆ (1/5)</SelectItem>
                                <SelectItem value="2" className="text-sm">★★☆☆☆ (2/5)</SelectItem>
                                <SelectItem value="3" className="text-sm">★★★☆☆ (3/5)</SelectItem>
                                <SelectItem value="4" className="text-sm">★★★★☆ (4/5)</SelectItem>
                                <SelectItem value="5" className="text-sm">★★★★★ (5/5)</SelectItem>
                              </SelectContent>
                            </Select>
                                                                                </div>
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-xs sm:text-sm font-medium">Review</label>
                            <Textarea
                              name="review"
                              value={createReview.review || studentReview.review}
                              onChange={handleReviewChange}
                              placeholder="Write your review"
                              rows={4}
                              className="text-sm"
                            />
                                                                                </div>
                          <Button type="submit" size="sm">Update Review</Button>
                                                                            </form>
                                                                        )}
                                                                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
                                                                </div>
                                                            </div>
                                                        </div>

      {/* Lecture Modal */}
      <Dialog open={isLectureModalOpen} onOpenChange={setIsLectureModalOpen}>
        <DialogContent className="max-w-3xl sm:max-w-4xl md:max-w-5xl p-2 sm:p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold">
              {variantItem?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="relative bg-black rounded-lg overflow-hidden group video-container">
            <div 
              className="aspect-video cursor-pointer"
              onClick={handlePlayPause}
            >
              {variantItem?.file && (
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
                        controlsList: 'nodownload',
                        style: { pointerEvents: 'none' }
                      }
                    }
                  }}
                />
              )}
                                                    </div>
            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-1 sm:gap-2">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-gray-600 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${played * 100}%` }} 
                  />
                                                </div>
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-blue-400">
                      <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-blue-400"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-blue-400">
                      <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-blue-400"
                        onClick={handleMute}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
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
                      {formatTime(played * duration)} / {formatTime(duration)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 text-white hover:text-blue-400"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </Button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
          <div className="mt-2 sm:mt-3 md:mt-4 space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  Duration: {formatDuration(variantItem?.duration || "")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkLessonAsCompleted(variantItem?.id || 0)}
                className="w-full sm:w-auto"
              >
                <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                Mark as Complete
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
        <DialogContent className="max-w-lg sm:max-w-xl md:max-w-2xl p-2 sm:p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">{selectedConversation?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="h-[300px] sm:h-[400px] overflow-y-auto space-y-2 sm:space-y-3">
              {selectedConversation?.messages?.map((message: { date: string; message: string; profile: { full_name: string } }, index: number) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 bg-gray-50 p-2 sm:p-3 md:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200" />
                      <div>
                        <p className="text-sm sm:text-base font-medium">
                          {message.profile.full_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {moment(message.date).format("DD MMM, YYYY")}
                        </p>
                                                    </div>
                                                </div>
                    <p className="text-sm sm:text-base">{message.message}</p>
                                            </div>
                                        </div>
              ))}
              <div ref={lastElementRef} />
            </div>
            <form onSubmit={sendNewMessage} className="flex gap-2">
              <Textarea
                name="message"
                value={createMessage.message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="flex-1 text-sm"
                rows={2}
              />
              <Button type="submit" size="sm" className="h-auto">
                <Send className="h-4 w-4" />
              </Button>
            </form>
                    </div>
        </DialogContent>
      </Dialog>
                        </div>
  );
}
