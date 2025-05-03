"use client";

import { useEffect, useState } from "react";
import { register } from "@/utils/auth";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [wallet_address, setWallet_Address] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    const { error } = await register(fullname, email, password, password2, wallet_address);
    if (error) {
      alert(JSON.stringify(error));
    } else {
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Illustration Section */}
        <div className="hidden lg:block relative w-full lg:w-1/2 bg-blue-50">
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <Image
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
              alt="Registration illustration"
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
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">L</span>
                </div>
                <span className="text-gray-900 text-2xl font-bold">LMS</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="mt-3 text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="wallet_address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                 Cardano Wallet Address
                </label>
                <input
                  id="wallet_address"
                  name="wallet_address"
                  type="text"
                  value={wallet_address}
                  onChange={(e) => setWallet_Address(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="addr1q9..."
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  required
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {password2 !== password && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
