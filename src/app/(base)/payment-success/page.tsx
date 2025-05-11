"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiInstance from "@/utils/axios";

interface Course {
  id: number;
  title: string;
  image: string;
  slug: string;
  description: string;
  price: string;
  language: string;
  level: string;
  duration: string;
  students_count: number;
  rating: number;
}

interface Order {
  id: number;
  order_items: {
    course: Course;
  }[];
  total: string;
  oid: string;
  date: string;
  payment_status: string;
}

function PaymentSuccessContent() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        const response = await apiInstance.get(`order/checkout/${orderId}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primaryCustom-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-buttonsCustom-700"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-primaryCustom-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <Link
            href="/"
            className="text-buttonsCustom-700 hover:text-buttonsCustom-800"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primaryCustom-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. You are now enrolled in your courses.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{order.oid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
            <div className="space-y-6">
              {order.order_items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.course.image}
                      alt={item.course.title}
                      fill
                      sizes="96px"
                      className="object-cover rounded-lg"
                      priority={index === 0}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {item.course.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>{item.course.duration}</span>
                      <span>•</span>
                      <span>{item.course.level}</span>
                      <span>•</span>
                      <span>{item.course.language}</span>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Link
              href="/student/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-buttonsCustom-700 hover:bg-buttonsCustom-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonsCustom-500"
            >
              Go to Dashboard
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primaryCustom-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-buttonsCustom-700"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
} 