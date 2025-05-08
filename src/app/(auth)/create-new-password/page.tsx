"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiInstance from "@/utils/axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Image from "next/image";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const otp = searchParams.get("otp");
  const uuidb64 = searchParams.get("uuidb64");

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordConfirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(true);
      return;
    }

    setError(false);

    try {
      const formData = new FormData();
      formData.append("otp", otp || "");
      formData.append("uuidb64", uuidb64 || "");
      formData.append("password", password);

      const response = await apiInstance.post(`user/password-change/`, formData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Password Changed Successfully",
        });
        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "An Error Occurred. Please Try Again",
        });
      }
    } catch (error: unknown) {
      console.error("Password change error:", error);
      let errorMessage = "An Error Occurred. Please Try Again";
      
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Illustration Section */}
        <div className="hidden lg:block relative w-full lg:w-1/2 bg-blue-50">
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <Image
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
              alt="Create New Password illustration"
              width={500}
              height={500}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-center text-3xl font-bold text-gray-900 mb-4">
              Create New Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="password"
                >
                  Enter New Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  name="password"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleNewPasswordChange}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  name="confirmPassword"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={handleNewPasswordConfirmChange}
                />
                {error !== null && (
                  <>
                    {error === true ? (
                      <p className="text-sm text-red-600 mt-2">
                        Password Does Not Match
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 mt-2">
                        Password Matched
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Wrap the component in Suspense
export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePassword />
    </Suspense>
  );
}
