"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiInstance from "@/utils/axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const otp = searchParams.get("otp");
  const uuidb64 = searchParams.get("uuidb64");

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (confirmPassword) setError(event.target.value !== confirmPassword);
  };

  const handleNewPasswordConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setError(event.target.value !== password);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("otp", otp || "");
      formData.append("uuidb64", uuidb64 || "");
      formData.append("password", password);

      const response = await apiInstance.post(`user/password-change/`, formData);

      if (response.status === 200 || response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Password Changed",
          text: "Your password has been updated successfully",
          backdrop: `
            rgba(0,0,0,0.4)
            url("/images/nyan-cat.gif")
            center top
            no-repeat
          `,
          showConfirmButton: false,
          timer: 2000
        });
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error("Password change error:", error);
      let errorMessage = "An error occurred. Please try again";
      
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#FF8080",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20 flex flex-col lg:flex-row"
      >
        {/* Illustration Section */}
        <div className="hidden lg:flex relative w-full lg:w-1/2 bg-gradient-to-br from-buttonsCustom-50 to-buttonsCustom-100">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src="https://illustrations.popsy.co/amber/resetting-password.svg"
                alt="Password reset illustration"
                width={500}
                height={500}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8 sm:p-10">
          <div className="w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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
                Create New Password
              </h2>
              <p className="text-gray-600">
                Your new password must be different from previous used passwords
              </p>
            </motion.div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="password"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    required
                    name="password"
                    className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-buttonsCustom-300 focus:outline-none focus:ring-2 focus:ring-buttonsCustom-100 transition-all"
                    onChange={handleNewPasswordChange}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    name="confirmPassword"
                    className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-buttonsCustom-300 focus:outline-none focus:ring-2 focus:ring-buttonsCustom-100 transition-all"
                    onChange={handleNewPasswordConfirmChange}
                  />
                  <AnimatePresence>
                    {error !== null && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-sm mt-2 ${error ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {error ? 'Passwords do not match' : 'Passwords match!'}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-2"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg px-4 py-3.5 text-center text-sm font-semibold text-white shadow-md transition-all ${
                    isSubmitting
                      ? 'bg-buttonsCustom-400 cursor-not-allowed'
                      : 'bg-buttonsCustom-500 hover:bg-buttonsCustom-600'
                  } focus:outline-none focus:ring-2 focus:ring-buttonsCustom-300 focus:ring-offset-2`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700">
        <div className="animate-pulse flex space-x-4">
          <div className="w-12 h-12 bg-buttonsCustom-100 rounded-full"></div>
        </div>
      </div>
    }>
      <CreatePassword />
    </Suspense>
  );
}