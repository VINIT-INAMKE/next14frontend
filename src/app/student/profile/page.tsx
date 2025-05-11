"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { Camera, User, MapPin, Info } from "lucide-react";
import useAxios from "@/utils/axios";
import UserData from "@/views/plugins/UserData";
import StudentHeader from "@/components/student/Header";
import StudentSidebar from "@/components/student/Sidebar";
import Toast from "@/views/plugins/Toast";
import { ProfileContext } from "@/views/plugins/Context";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProfileData {
  image: string | File;
  full_name: string;
  about: string;
  country: string;
}

function Profile() {
  const [, setProfile] = useContext(ProfileContext);
  const [profileData, setProfileData] = useState<ProfileData>({
    image: "",
    full_name: "",
    about: "",
    country: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await useAxios.get(`user/profile/${UserData()?.user_id}/`);
      setProfile(res.data);
      setProfileData({
        ...res.data,
        image: res.data.image || "",
      });
      setImagePreview(res.data.image || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [setProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleProfileChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setProfileData({
      ...profileData,
      image: selectedFile,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await useAxios.get(`user/profile/${UserData()?.user_id}/`);
      const formdata = new FormData();
      
      if (profileData.image && profileData.image !== res.data.image) {
        if (profileData.image instanceof File) {
          formdata.append("image", profileData.image);
        }
      }

      formdata.append("full_name", profileData.full_name);
      formdata.append("about", profileData.about);
      formdata.append("country", profileData.country);

      const response = await useAxios.patch(
        `user/profile/${UserData()?.user_id}/`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setProfile(response.data);
      Toast().fire({
        icon: "success",
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast().fire({
        icon: "error",
        title: "Failed to update profile",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <StudentHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 mt-4 sm:mt-8">
          <StudentSidebar />
          
          <div className="lg:col-span-3">
            <Card className="border-buttonsCustom-200">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-buttonsCustom-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-buttonsCustom-600" />
                  Profile Details
                </CardTitle>
                <CardDescription>
                  You have full control to manage your own account settings.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt={profileData.full_name}
                        width={150}
                        height={150}
                        className="rounded-full"
                      />
                      <label
                        htmlFor="image-upload"
                        className="absolute bottom-0 right-0 bg-buttonsCustom-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-buttonsCustom-700 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-buttonsCustom-900">Your avatar</h4>
                      <p className="text-sm text-gray-500">
                        PNG or JPG no bigger than 800px wide and tall.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-buttonsCustom-900 mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-buttonsCustom-600" />
                        Personal Details
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleProfileChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="about">About Me</Label>
                          <Textarea
                            id="about"
                            name="about"
                            value={profileData.about}
                            onChange={handleProfileChange}
                            placeholder="Tell us about yourself"
                            rows={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-buttonsCustom-600" />
                            Country
                          </Label>
                          <Input
                            id="country"
                            name="country"
                            value={profileData.country}
                            onChange={handleProfileChange}
                            placeholder="Enter your country"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full sm:w-auto">
                      Update Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
