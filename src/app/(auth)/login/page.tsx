"use client";

import { useState } from "react";
import { login } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import { LockClosedIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await login(email, password);
      if (error) {
        alert(error);
      } else {
        await router.push("/");
      }
    } catch (err) {
      alert("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700">

      
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
              {/* Gradient Header Strip */}
              <div className="h-2 bg-gradient-to-r from-buttonsCustom-900 to-buttonsCustom-700" />

              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <LockClosedIcon className="h-8 w-8 text-buttonsCustom-900 mx-auto" />
                  <h1 className="text-2xl font-bold text-buttonsCustom-900">
                    Decentralized Learning Portal
                  </h1>
                  <p className="text-buttonsCustom-700">
                    Secure access to your blockchain-based learning resources
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-buttonsCustom-900   mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-buttonsCustom-50 border border-buttonsCustom-700 rounded-lg px-4 py-3 
                              placeholder-buttonsCustom-600 focus:ring-2 focus:ring-buttonsCustom-700 focus:outline-none"
                      placeholder="learner@decentralized.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-buttonsCustom-900 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-buttonsCustom-50 border border-buttonsCustom-700 rounded-lg px-4 py-3 
                              placeholder-buttonsCustom-600 focus:ring-2 focus:ring-buttonsCustom-700 focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-buttonsCustom-900 to-buttonsCustom-700 text-white 
                            font-medium rounded-lg shadow-md p-3 transition-all duration-300 
                            hover:from-buttonsCustom-900 hover:to-buttonsCustom-700 relative"
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LockClosedIcon className="h-5 w-5" />
                        <span>Authenticate with DID</span>
                      </div>
                    )}
                  </motion.button>
                </form>

                <div className="text-center text-buttonsCustom-900 text-sm">
                  <Link 
                    href="/forgotpassword"
                    className="hover:text-buttonsCustom-400 transition-colors duration-300"
                  >
                    Forgot decentralized identity?
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-buttonsCustom-800" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-buttonsCustom-800">
                      Alternative access methods
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 bg-buttonsCustom-50 text-buttonsCustom-900 
                          rounded-lg p-3 border border-buttonsCustom-200 hover:bg-buttonsCustom-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </motion.button>
              </div>
            </div>

            <p className="mt-4 text-center text-buttonsCustom-900">
              New to decentralized learning?{" "}
              <Link
                href="/register"
                className="font-medium hover:text-buttonsCustom-400 transition-colors duration-300"
              >
                Register now
              </Link>
            </p>
          </div>
        </motion.main>

      </div>
  );
};

export default Login;