"use client";

import { useEffect, useState } from "react";
import { register } from "@/utils/auth";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LockClosedIcon, 
  ArrowPathIcon, 
  UserIcon, 
  AtSymbolIcon,
  WalletIcon,
  FingerPrintIcon 
} from "@heroicons/react/24/outline";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [wallet_address, setWallet_Address] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await register(
        fullname,
        email,
        password,
        password2,
        wallet_address
      );
      
      if (error) {
        setError(typeof error === 'string' ? error : JSON.stringify(error));
      } else {
        await router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primaryCustom-300 to-primaryCustom-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20">
          {/* Gradient Header */}
          <div className="h-2 bg-gradient-to-r from-buttonsCustom-800 to-buttonsCustom-600" />

          <div className="p-8 space-y-6">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-3"
            >
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-buttonsCustom-50">
                <FingerPrintIcon className="h-6 w-6 text-buttonsCustom-700" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Your Decentralized Identity
              </h1>
              <p className="text-gray-600">
                Register to access blockchain learning resources
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-700 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 
                            placeholder-gray-400 focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 
                            placeholder-gray-400 focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Wallet Address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardano Wallet Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <WalletIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={wallet_address}
                    onChange={(e) => setWallet_Address(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 
                            placeholder-gray-400 focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent"
                    placeholder="addr1q9..."
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 
                            placeholder-gray-400 focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 
                            placeholder-gray-400 focus:ring-2 focus:ring-buttonsCustom-300 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-md transition-all
                          ${isLoading 
                            ? 'bg-buttonsCustom-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-buttonsCustom-700 to-buttonsCustom-600 hover:from-buttonsCustom-800 hover:to-buttonsCustom-700'
                          }`}
                >
                  {isLoading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <span className="text-white font-medium flex items-center gap-2">
                      <FingerPrintIcon className="h-5 w-5" />
                      Register Identity
                    </span>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">
                  Or register with
                </span>
              </div>
            </motion.div>

            {/* Social Login */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 
                        text-gray-700 rounded-lg p-3 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    fill="currentColor"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-sm text-buttonsCustom-800"
        >
          <span className="opacity-80">Already have an identity? </span>
          <Link
            href="/login"
            className="font-medium text-buttonsCustom-900 hover:underline"
          >
            Sign in to your account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;