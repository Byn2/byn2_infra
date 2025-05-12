//@ts-ignore
//@ts-nocheck
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Copy,
  Save,
  Share2,
  User,
  Building,
  FileText,
  CheckCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  createdAt: string;
  updatedAt: string;
  businessName?: string;
  phoneNumber?: string;
  Byn2Address?: string;
  businessDescription?: string;
}

export default function ProfilePage() {
  //   const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Byn2Address, setByn2Address] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data.profile);

        // Set form values from profile data
        setBusinessName(data.profile.businessName || data.profile.name || "");
        setPhoneNumber(data.profile.phoneNumber || "");
        setByn2Address(
          data.profile.Byn2Address ||
            "FtxUXFfH8BUFGWcH@hboUxmJJP67JqjhDpBGbeCzVv"
        );
        setBusinessDescription(data.profile.businessDescription || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load profile information",
        //   variant: "destructive",
        // })
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: businessName,
          phoneNumber,
          Byn2Address,
          businessDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setProfile(data.profile);

      //   toast({
      //     title: "Success",
      //     description: "Profile updated successfully",
      //   })
    } catch (error) {
      console.error("Error updating profile:", error);
      //   toast({
      //     title: "Error",
      //     description: "Failed to update profile",
      //     variant: "destructive",
      //   })
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    // toast({
    //   title: "Copied",
    //   description: message,
    // });
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#01133B]"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Account</h1>

        <div className="mt-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 ${
                activeTab === "profile"
                  ? "border-b-2 border-[#01133B] font-medium text-[#01133B]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="inline-block mr-2 h-4 w-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("bank")}
              className={`pb-2 ${
                activeTab === "bank"
                  ? "border-b-2 border-[#01133B] font-medium text-[#01133B]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Building className="inline-block mr-2 h-4 w-4" />
              Bank Account(s)
            </button>
            <button
              onClick={() => setActiveTab("setting")}
              className={`pb-2 ${
                activeTab === "setting"
                  ? "border-b-2 border-[#01133B] font-medium text-[#01133B]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Settings className="inline-block mr-2 h-4 w-4" />
              Setting
            </button>
            <button
              onClick={() => setActiveTab("help")}
              className={`pb-2 ${
                activeTab === "help"
                  ? "border-b-2 border-[#01133B] font-medium text-[#01133B]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="inline-block mr-2 h-4 w-4" />
              Help
            </button>
          </div>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="bg-[#FAF7F2] rounded-lg p-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <Avatar className="h-20 w-20 mr-4">
                  <AvatarImage
                    src="/diverse-group-city.png"
                    alt={profile?.name || "User"}
                  />
                  <AvatarFallback className="text-xl">
                    {profile?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profile?.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600 mr-2">
                      {profile?.email}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+232 78 490070"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="Byn2-address">Byn2 Address</Label>
                <div className="relative mt-1">
                  <Input
                    id="Byn2-address"
                    value={Byn2Address}
                    onChange={(e) => setByn2Address(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      copyToClipboard(
                        Byn2Address,
                        "Byn2 address copied to clipboard"
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="business-description">
                  Business Description
                </Label>
                <Textarea
                  id="business-description"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your business"
                  className="mt-1 h-32"
                />
              </div>

              <div>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-[#01133B] hover:bg-[#523526]"
                >
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "bank" && (
        <div className="bg-[#FAF7F2] rounded-lg p-8">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
            <p className="text-gray-500">
              Connect your bank accounts to easily transfer funds.
            </p>

            <div className="mt-6 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500 mb-4">
                No bank accounts connected yet
              </p>
              <Button className="bg-[#01133B] hover:bg-[#523526]">
                Connect Bank Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "setting" && (
        <div className="bg-[#FAF7F2] rounded-lg p-8">
          <Tabs defaultValue="password">
            <TabsList className="mb-4">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Password settings are available in the Settings page.
                  </p>
                  <Button
                    className="mt-4 bg-[#01133B] hover:bg-[#523526]"
                    onClick={() =>
                      (window.location.href = "/dashboard/settings")
                    }
                  >
                    Go to Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Notification settings will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Security settings will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {activeTab === "help" && (
        <div className="bg-[#FAF7F2] rounded-lg p-8">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Help & Support</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">How do I reset my password?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      You can reset your password by going to the Settings page
                      and selecting the Password tab.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      How do I connect a bank account?
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Go to the Bank Account(s) tab and click on "Connect Bank
                      Account" to link your bank.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">Is my data secure?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Yes, we use industry-standard encryption to protect your
                      data and financial information.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Need more help? Our support team is available 24/7.
                </p>
                <Button variant="outline">Contact Support</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Settings({
  className,
  ...props
}: React.ComponentProps<typeof Settings>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
