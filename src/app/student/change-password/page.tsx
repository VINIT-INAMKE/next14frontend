"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import StudentHeader from "@/components/student/Header";
import StudentSidebar from "@/components/student/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";

interface PasswordForm {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState<PasswordForm>({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({
      ...password,
      [event.target.name]: event.target.value,
    });
  };

  const changePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.confirm_new_password !== password.new_password) {
      toast.error("New passwords do not match", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      setIsLoading(false);
      return;
    }

    try {
      const userId = UserData()?.user_id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      const formData = new FormData();
      formData.append("user_id", userId.toString());
      formData.append("old_password", password.old_password);
      formData.append("new_password", password.new_password);

      const response = await useAxios.post(`user/change-password/`, formData);
      
      toast.success(response.data.message, {
        icon: <CheckCircle className="h-4 w-4" />,
      });
      
      // Clear form
      setPassword({
        old_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } catch (error) {
      toast.error("Failed to change password", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <StudentHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
          <StudentSidebar />
          
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-buttonsCustom-200">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl text-buttonsCustom-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-buttonsCustom-600" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={changePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="old_password" className="text-buttonsCustom-700">
                          Old Password
                        </Label>
                        <Input
                          id="old_password"
                          type="password"
                          name="old_password"
                          value={password.old_password}
                          onChange={handlePasswordChange}
                          placeholder="Enter your current password"
                          className="border-buttonsCustom-200 focus:border-buttonsCustom-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new_password" className="text-buttonsCustom-700">
                          New Password
                        </Label>
                        <Input
                          id="new_password"
                          type="password"
                          name="new_password"
                          value={password.new_password}
                          onChange={handlePasswordChange}
                          placeholder="Enter your new password"
                          className="border-buttonsCustom-200 focus:border-buttonsCustom-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm_new_password" className="text-buttonsCustom-700">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm_new_password"
                          type="password"
                          name="confirm_new_password"
                          value={password.confirm_new_password}
                          onChange={handlePasswordChange}
                          placeholder="Confirm your new password"
                          className="border-buttonsCustom-200 focus:border-buttonsCustom-500"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-gradient-to-r from-buttonsCustom-600 to-buttonsCustom-700 hover:from-buttonsCustom-700 hover:to-buttonsCustom-800"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Updating Password...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Save New Password</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
