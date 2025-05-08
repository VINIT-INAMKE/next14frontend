"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import apiInstance from "@/utils/axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const axios = apiInstance;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null);
  };

  const handleEmailSubmit = () => {
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    axios
      .get(`user/password-reset/${email}/`)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Password Reset Email Sent!",
        });
        router.push("/login");
      })
      .catch(() => {
        setError("Failed to send password reset email. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Form Section */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-center text-3xl font-bold text-gray-900 mb-4">
              Forgot Password
            </h3>
            <p className="text-center text-gray-600 mb-8">
              Enter your email address to reset your password.
            </p>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleEmailChange}
                  value={email}
                  placeholder="name@company.com"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>

              <div className="text-center">
                <button
                  onClick={handleEmailSubmit}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </button>
              </div>
            </div>
          </div>
        </div>

    
       
      </motion.div>
    </div>
  );
}

export default ForgotPassword;