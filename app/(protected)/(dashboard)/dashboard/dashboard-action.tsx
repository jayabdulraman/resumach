"use client";
import { CustomizedResumeDataTable } from "@/components/customize-resume-data-table";
import { UploadedResumeDataTable } from "@/components/upload-resume-data-table";
import React, { useEffect, useState, useCallback } from "react";
import { PlusIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DocumentUploaderComponent } from "@/components/document-uploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeDto } from "@/lib/dto/resume";
import { useRateLimitStore } from "@/utils/stores/rateLimitStore";
import { format } from "date-fns";
import { fetchUserUploadedFilesWithDetails, fetchUserCustomizedFilesWithDetails } from "@/lib/adapter/actions";
import { UserDto } from "@/lib/dto/user";
import { useAuthStore } from "@/utils/stores/auth";

type FileData = {
  id: string;
  owner: string;
  fileName: string;
  fileUrl: string;
  dateModified: string;
  fileSize: number;
  fileType: string;
  resume: ResumeDto | undefined;
};

interface rateLimitDetails {
  remaining: number;
  resetAt: Date; 
}

type RateLimit = {
  error: string;
  rateLimitDetails: rateLimitDetails;
}

type UserProfile = {
  id: number;
  current_subscription_id: string;
  current_subscription_type: string;
  user_id: string;
  updated_at: string;
}

interface FileInterface {
  UploadedUserFiles: FileData[];
  CustomizedUserFiles: FileData[];
  user: UserDto;
  rateLimit: RateLimit;
  userProfile: UserProfile;
}

export function DashboardView({ UploadedUserFiles, CustomizedUserFiles, user, rateLimit, userProfile}: FileInterface) {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [customizedFiles, setCustomizedFiles] = useState<FileData[]>([]);
  const { limitError, remaining, resetAt, setLimitError, setLimitInfo } = useRateLimitStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const [newUploadedFiles, newCustomizedFiles] = await Promise.all([
        fetchUserUploadedFilesWithDetails(user.id),
        fetchUserCustomizedFilesWithDetails(user.id)
      ]);
      setUploadedFiles(newUploadedFiles);
      setCustomizedFiles(newCustomizedFiles);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (UploadedUserFiles) {
      setUploadedFiles(UploadedUserFiles);
    }
    if (CustomizedUserFiles) {
      setCustomizedFiles(CustomizedUserFiles);
    }
  }, [UploadedUserFiles, CustomizedUserFiles]);

  useEffect(() => {
    if (rateLimit) {
      if ('remaining' in rateLimit && 'resetAt' in rateLimit) {
        setLimitInfo({
          remaining: rateLimit.remaining as number,
          resetAt: new Date(rateLimit.resetAt as Date),
        });
      } else {
        setLimitError(rateLimit.error);
      }
    }
  }, [rateLimit, setLimitInfo, setLimitError]);


  useEffect(() => {
    // set user session state
    useAuthStore.setState({user: user, userCurrentSubscription: userProfile?.current_subscription_type})
  }, [])
  

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <header>
        <h2 className="text-3xl font-bold">Tailor resume</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <Card className="flex flex-col">
          <CardContent className="p-6 flex-grow flex flex-col items-center justify-center">
            <Dialog>
              <DialogTrigger asChild disabled={remaining === 0}> 
                <Button
                  disabled={remaining === 0} // or if user used all credits (for pro users)
                  variant="outline"
                  className="h-full w-full border-transparent focus:border-transparent disabled flex items-center justify-center hover:bg-transparent"
                >
                  {remaining > 0 ?  // or if user used all credits (for pro users)
                    <PlusIcon className="h-12 w-12 text-gray-400" /> :
                    <X className="h-12 w-12 text-red-400 cursor-not-allowed"/>}
                </Button>
              </DialogTrigger>
              <DocumentUploaderComponent userId={user?.id} onUploadSuccess={refreshData} />
            </Dialog>
          </CardContent>
          <CardFooter className="text-sm text-center border-t pt-5">
            {remaining > 0 ? ( // or if user used all credits (for pro users)
              <p>Tailor your resume to match the job description</p>
            ) : (
              <p className="text-red-600">
                You can only tailor 5 resumes in 24 hours. Try again on {resetAt && format(resetAt, 'MMM dd, h:mm a')} or Upgrade!
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
      <header>
        <h2 className="text-3xl font-bold">My resumes</h2>
      </header>
      <div className="container mx-auto">
        <Tabs defaultValue="customized">
          <TabsList>
            <TabsTrigger value="customized">Tailored resumes</TabsTrigger>
            <TabsTrigger value="uploaded">Uploaded resumes</TabsTrigger>
          </TabsList>
          <TabsContent value="customized">
            <CustomizedResumeDataTable data={customizedFiles} onDeleteSuccess={refreshData} />
          </TabsContent>
          <TabsContent value="uploaded">
            <UploadedResumeDataTable data={uploadedFiles} onDeleteSuccess={refreshData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}