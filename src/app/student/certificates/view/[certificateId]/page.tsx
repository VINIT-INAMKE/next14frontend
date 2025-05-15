"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from 'html2canvas';
import {
  Award,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";
import StudentHeader from "@/components/student/Header";
import StudentSidebar from "@/components/student/Sidebar";
import Toast from "@/views/plugins/Toast";

interface CertificateDetail {
  id: number;
  course: {
    id: number;
    title: string;
    description: string;
    level: string;
    image: string | null;
  };
  user: {
    id: number;
    full_name: string | null;
    username: string;
  };
  certificate_id: string;
  student_name: string;
  course_name: string;
  completion_date: string;
  issue_date: string;
  verification_url: string | null;
  status: "active" | "revoked" | "expired";
  pdf_file: string | null;
  metadata: Record<string, unknown>;
  course_title: string;
  teacher_name: string | null;
  user_name: string | null;
  course_image: string | null;
  course_level: string;
  course_description: string;
}



export default function CertificateDetailPage() {
  const [certificate, setCertificate] = useState<CertificateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { certificateId } = useParams();
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setIsLoading(true);
      try {
        const userId = UserData()?.user_id;
        if (!userId || !certificateId) {
          throw new Error("Missing required parameters");
        }

        const response = await useAxios.get(
          `/student/certificate/detail/${userId}/${certificateId}/`
        );
        setCertificate(response.data);
      } catch (error) {
        console.error("Error fetching certificate:", error);
        Toast().fire({
          icon: "error",
          title: "Failed to load certificate. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  const handleDownload = async () => {
    if (!certificateRef.current || !certificate) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/jpeg', 0.95);
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificate_id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Toast().fire({
        icon: "success",
        title: "Certificate downloaded successfully!",
      });
    } catch (error) {
      console.error("Error generating certificate image:", error);
      Toast().fire({
        icon: "error",
        title: "Failed to download certificate. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!certificate) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${certificate.course_title}`,
          text: `Check out my certificate for completing ${certificate.course_title}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing certificate:", error);
      }
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(window.location.href);
      Toast().fire({
        icon: "success",
        title: "Certificate link copied to clipboard!",
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>

      <div className="relative aspect-[1.4/1] w-full bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-4">
          <Skeleton className="h-8 w-64 rounded" />
          <Skeleton className="h-20 w-full max-w-md rounded" />
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-6 w-60 rounded" />
          <Skeleton className="h-6 w-80 rounded" />
          <Skeleton className="h-6 w-40 rounded my-4" />
          <Skeleton className="h-10 w-40 rounded" />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl print:max-w-none print:px-0">
        <div className="print:hidden">
          <StudentHeader />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8 print:block print:mt-0">
          <div className="lg:sticky lg:top-4 lg:self-start print:hidden">
            <StudentSidebar />
          </div>

          <div className="lg:col-span-3 space-y-5 sm:space-y-7 print:space-y-0">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 mb-2 print:hidden"
            >
              <div className="h-10 w-10 rounded-full bg-buttonsCustom-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-buttonsCustom-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Certificate</h4>
                <p className="text-sm text-gray-500">
                  Your achievement for completing the course
                </p>
              </div>
            </motion.div>

            {/* Certificate Actions */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-wrap gap-3 print:hidden"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleDownload}
                      disabled={isLoading || isDownloading}
                      className="bg-buttonsCustom-600 hover:bg-buttonsCustom-700"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Image...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Image
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download certificate as JPG</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handlePrint}
                      disabled={isLoading}
                      variant="outline"
                      className="border-buttonsCustom-200 text-buttonsCustom-600 hover:bg-buttonsCustom-50"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print certificate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleShare}
                      disabled={isLoading}
                      variant="outline"
                      className="border-buttonsCustom-200 text-buttonsCustom-600 hover:bg-buttonsCustom-50"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share certificate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {certificate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="border-buttonsCustom-200 text-buttonsCustom-600 hover:bg-buttonsCustom-50"
                      >
                        <Link
                          href={`/verify-certificate/${certificate.certificate_id}`}
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Verify
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verify certificate authenticity</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </motion.div>

            {/* Certificate Display */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="print:mt-0"
            >
              {isLoading ? (
                renderSkeleton()
              ) : certificate ? (
                <div className="w-full max-h-[90vh] overflow-auto bg-white border border-gray-200 rounded-lg p-4">
                  {/* Certificate container with true A4 dimensions (210mm × 297mm at 96 DPI) */}
                  <div className="min-w-[793.7px] mx-auto">
                    <div 
                      ref={certificateRef}
                      className="relative rounded-lg overflow-hidden shadow-xl"
                      style={{ 
                        width: "793.7px", // 210mm
                        height: "1122.5px", // 297mm
                        backgroundColor: "#ffffff",
                        margin: "0 auto"
                      }}
                    >
                      {/* Certificate Content with proper margins */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          padding: "96px", // ~1 inch margins
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        {/* Header with Logo and Certificate Info */}
                        <div className="flex justify-between items-start" style={{ marginBottom: "64px" }}>
                          <div className="flex items-center space-x-3">
                            <Award className="h-10 w-10 text-purple-600" />
                            <div>
                              <span className="text-2xl font-bold text-purple-600 block">Cardano Academy</span>
                              <span className="text-sm text-gray-500">Blockchain Education Excellence</span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500 space-y-1">
                            <p>Certificate ID: {certificate.certificate_id}</p>
                            <p>Issue Date: {new Date(certificate.issue_date).toLocaleDateString()}</p>
                            <p>Reference Number: {certificate.certificate_id.slice(0, 8)}</p>
                          </div>
                        </div>

                        {/* Certificate Title Section - Centered with proper spacing */}
                        <div className="text-center" style={{ marginBottom: "64px" }}>
                          <h1 className="text-gray-600 text-2xl font-medium" style={{ marginBottom: "32px" }}>
                            CERTIFICATE OF COMPLETION
                          </h1>
                          <p className="text-gray-500" style={{ marginBottom: "24px" }}>This is to certify that</p>
                          <h2 className="text-4xl font-bold text-gray-900" style={{ marginBottom: "24px" }}>
                            {certificate.student_name}
                          </h2>
                          <p className="text-gray-500" style={{ marginBottom: "32px" }}>has successfully completed the course</p>
                          <div 
                            className="bg-gray-50 border border-gray-200 rounded-lg mx-auto"
                            style={{ 
                              maxWidth: "600px",
                              padding: "24px 48px"
                            }}
                          >
                            <h3 className="text-2xl font-bold text-gray-900">
                              {certificate.course_title}
                            </h3>
                          </div>
                        </div>

                        {/* Course Information - Grid with consistent spacing */}
                        <div 
                          className="grid grid-cols-2"
                          style={{ 
                            gap: "64px",
                            marginBottom: "64px"
                          }}
                        >
                          <div>
                            <h4 className="text-sm font-medium text-gray-500" style={{ marginBottom: "16px" }}>
                              COURSE DETAILS
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Level</p>
                                <p className="text-gray-900 font-medium">{certificate.course_level}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-900">{certificate.course_description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500" style={{ marginBottom: "16px" }}>
                              ACHIEVEMENT DETAILS
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Instructor</p>
                                <p className="text-gray-900 font-medium">{certificate.teacher_name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Completion Date</p>
                                <p className="text-gray-900">
                                  {new Date(certificate.completion_date).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className="flex items-center mt-1">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-green-600 font-medium">Successfully Completed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Skills and Competencies - Fixed width container */}
                        <div style={{ marginBottom: "64px" }}>
                          <h4 className="text-sm font-medium text-gray-500" style={{ marginBottom: "16px" }}>
                            SKILLS & COMPETENCIES ACHIEVED
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {certificate.metadata?.skills ? (
                              Array.isArray(certificate.metadata.skills) ? 
                                certificate.metadata.skills.map((skill: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))
                                : null
                            ) : (
                              <span className="text-gray-500">Core blockchain development competencies</span>
                            )}
                          </div>
                        </div>

                        {/* Verification Footer - Fixed to bottom */}
                        <div className="mt-auto">
                          <div 
                            className="flex justify-between items-center border-t border-gray-200"
                            style={{ paddingTop: "32px" }}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-2 bg-green-50 text-green-600 px-3 py-1 rounded-full">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Verified on Cardano Blockchain</span>
                              </div>
                            </div>
                            <div>
                              <QRCodeSVG 
                                value={`${window.location.origin}/verify-certificate/${certificate.certificate_id}`}
                                size={64}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
                  <CardContent className="flex flex-col items-center justify-center pt-6">
                    <AlertCircle className="h-12 w-12 text-buttonsCustom-300 mb-4" />
                    <h3 className="text-lg font-medium text-buttonsCustom-900 mb-2">
                      Certificate Not Found
                    </h3>
                    <p className="text-buttonsCustom-500 text-center mb-4">
                      The certificate you are looking for does not exist or you
                      don&apos;t have permission to view it.
                    </p>
                    <Button
                      asChild
                      className="bg-buttonsCustom-600 hover:bg-buttonsCustom-700 mt-2"
                    >
                      <Link href="/student/certificates/generate">
                        Back to Certificates
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
