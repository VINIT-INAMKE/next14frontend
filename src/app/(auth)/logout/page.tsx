"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";

const REDIRECT_DELAY = 5; // seconds

const Logout = () => {
  const router = useRouter();
  const progressControls = useAnimation();

  useEffect(() => {
    logout();

    progressControls.start({
      width: "100%",
      transition: { duration: REDIRECT_DELAY, ease: "linear" },
    });

    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, REDIRECT_DELAY * 1000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router, progressControls]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Content Section */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={progressControls}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>

            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="h-12 w-12 text-green-600"
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
              </motion.svg>
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Successfully Logged Out
              </h2>
              <p className="text-gray-600 mb-2">
                Thank you for using our service. We hope to see you again soon!
              </p>
            </motion.div>
          </div>
        </div>

        {/* Illustration Section */}

      </motion.div>
    </div>
  );
};

export default Logout;
