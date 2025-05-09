"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter a valid email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email format");
      return;
    }

    setIsLoading(true);
    
    axios
      .get(`user/password-reset/${email}/`)
      .then(() => {
        Swal.fire({
          title: "Check Your Email!",
          html: `
            <div class="text-center">
              <div class="mx-auto mb-4 h-16 w-16 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p>We've sent password reset instructions to <strong>${email}</strong></p>
              <p class="mt-2 text-sm text-gray-600">If you don't see the email, check your spam folder.</p>
            </div>
          `,
          confirmButtonColor: "#FF8080",
          backdrop: `
            rgba(0,0,0,0.4)
            url("/images/nyan-cat.gif")
            left top
            no-repeat
          `
        });
        router.push("/login");
      })
      .catch(() => {
        setError("This email isn't registered. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="p-8 sm:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-buttonsCustom-50 mb-4">
              <svg
                className="h-8 w-8 text-buttonsCustom-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              No worries! Enter your email to reset your password.
            </p>
          </motion.div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-buttonsCustom-300 focus:outline-none focus:ring-2 focus:ring-buttonsCustom-100 transition-all"
                  onChange={handleEmailChange}
                  value={email}
                  placeholder="name@company.com"
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-red-600 mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md transition-all ${
                  isLoading
                    ? 'bg-buttonsCustom-400 cursor-not-allowed'
                    : 'bg-buttonsCustom-500 hover:bg-buttonsCustom-600'
                } focus:outline-none focus:ring-2 focus:ring-buttonsCustom-300 focus:ring-offset-2`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            Remember your password?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-buttonsCustom-600 hover:text-buttonsCustom-700 hover:underline focus:outline-none"
            >
              Sign in here
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;