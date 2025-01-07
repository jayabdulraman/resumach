"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { useFormState } from "react-dom";
import { extractTextAndKeywords } from "@/lib/adapter/actions";
import { extractTextFromDOCX } from "@/lib/adapter/text-extracter";
import { extractTextFromPDF } from "@/lib/adapter/pdf-extracter";
import { SubmitButton } from "./submit-button";
import { createClient } from "@/utils/supabase/client";
import { fetchUserUploadedFilesWithDetails } from "@/lib/adapter/actions";
import { useRouter } from "next/navigation";
import { useRateLimitStore } from '@/utils/stores/rateLimitStore';
import { checkRateLimit, RateLimitError } from "@/lib/rate-limit";
import { useDocumentStore } from "@/utils/stores/uploadFileStore";
import { useAuthStore } from "@/utils/stores/auth";

type FormState = {
  message?: string; // This will contain the resume ID
  error?: string;
};

type Document = {
  id: string;
  name: string;
  type: string;
  file: File;
  text: string;
};

const initialState: FormState = {
  message: undefined,
  error: undefined
};

interface UploaderProps {
  userId: string;
  onUploadSuccess: () => Promise<void>;
}

interface ExtractedData {
  text: string;
  hyperlinks: string[];
}


export function DocumentUploaderComponent({userId, onUploadSuccess}: UploaderProps) {
  const documents = useDocumentStore((state) => state.documents);
  const addDocument = useDocumentStore((state) => state.addDocument);
  const setDocuments = useDocumentStore((state) => state.setDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [jobDescription, setJobDescription] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newUploadFile, setNewUploadFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, formAction] = useFormState<FormState, FormData>(extractTextAndKeywords, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { setLimitError, setLimitInfo } = useRateLimitStore();
  const [ pendingText, setPendingText ] = useState(false);
  const userCurrentSubscription = useAuthStore((state) => state.userCurrentSubscription);

  // set navigation router
  const router = useRouter();

  // fetch file content
  const fetchFileContent = async (fileUrl: string): Promise<Blob> => {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch file content");
    }
    return await response.blob(); // Return the file content as a Blob
  };

  const fetchUserFiles = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser(); // Get the current logged-in user
    const userId = user?.id;

    if (userId) {
      // Fetch user files with details
      const fetchedDocuments = await fetchUserUploadedFilesWithDetails(userId);
      // Map the fetched documents to the Document type
      const newDocument: Document[] = await Promise.all(
        fetchedDocuments.map(async (doc: any) => {
          // Fetch the actual file content
          const fileContent = await fetchFileContent(doc.fileUrl);

          return {
            id: doc.id, // Assuming the id is directly available
            name: doc.fileName, // Assuming filename is available
            type:
              doc.fileType ||
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            file: new File([fileContent], doc.fileName, {
              type:
                doc.fileType ||
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }), // Create a placeholder File object
            text: doc.extractedText,
          };
        })
      );
      setDocuments(newDocument); // Update the state with fetched document
    }
  };

  useEffect(() => {
    fetchUserFiles(); // Call the function to fetch user files on component mount
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
          fileType === "application/pdf"
      ) {
        setNewFile(selectedFile);
        setNewUploadFile(selectedFile);
        setFileError("");
      } else {
        setNewFile(null);
        setNewUploadFile(null);
        setFileError("Please upload a PDF or DOCX file.");
      }
    }
  };

  const handleSelectFileChange = (value: string) => {
    const doc = documents.find((doc) => doc.id === value) || null;
    // Additional logic can be added here if needed
    if (doc) {
      setSelectedDocument(doc); // Set the selected document
      setNewFile(doc.file as File);
    }
  };

  async function handleUpload() {
    const supabase = createClient();
    if (newFile) {
      setPendingText(true);
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        
        if (newFile.size > 3242880) {
          setFileError("File must be less than 3mb!")
          return
        } 
        const { data: uploadedFile, error: uploadError } = await supabase.storage
          .from("resume-files")
          .upload(`${userId}/${newFile.name}`, newFile);

        if (uploadError) {
          setFileError(uploadError.message)
          return
        }

        let extractedResumeContent;

        if (newFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          const resumeText = await extractTextFromDOCX(newFile);
          const { data: textUploaded, error: textError} = await supabase.from("document_content")
          .insert({
            extracted_text: resumeText,
            file_id: uploadedFile.id,
            user_id: userId
          })
          .select()
          .single()

          if (textError) {
            setError("Failed to upload and parse DOCX. Please try again.");
          }
          // assign text a value
          extractedResumeContent = textUploaded.extracted_text
        } else if (newFile.type === "application/pdf") {
          const resumeText = await extractTextFromPDF(newFile);
          const { data: textUploaded, error: textError} = await supabase.from("document_content")
          .insert({
            extracted_text: resumeText,
            file_id: uploadedFile.id,
            user_id: userId
          })
          .select()
          .single()

          if (textError) {
            setError("Failed to upload and parse PDF. Please try again.");
            return
          }
           // assign text a value
           extractedResumeContent = textUploaded.extracted_text
        } else {
          setFileError("File is not supported! Try docx, doc or pdf!");
          return
        }
        // retrieve details of recent uploaded file
        const recentDocument: Document = {
          id: uploadedFile.id,
          name: newFile.name,
          type: newFile.type,
          file: newFile,
          text: extractedResumeContent,
        };

        addDocument(recentDocument);
        setSelectedDocument(recentDocument);
        setIsUploadModalOpen(false);
        setNewFile(newFile);
        setNewUploadFile(null);
        
        // Call the refresh callback after successful upload
        await onUploadSuccess();
      } catch (error) {
        return router.push("/dashboard");
      } finally {
        setPendingText(false);
      }
    }
  }

  const handleSubmit = async (formData: FormData) => {
    if (userCurrentSubscription === "Free") {
      // Check rate limit before processing
      try {
        const rateResult = await checkRateLimit(userId, 'customize-resume');
        if ('remaining' in rateResult && 'resetAt' in rateResult) {
          setLimitInfo({
            remaining: rateResult.remaining,
            resetAt: new Date(rateResult.resetAt),
          });
        }
      } catch(error) {
        setLimitError(error as string);
      }
    }

    try {
       // Get stored processingId if exists
      const storedProcessingId = localStorage.getItem('currentResumeProcessingId');
      
      formData.set("jobDescription", jobDescription);
      formData.set("userCurrentSubscription", userCurrentSubscription as string);
      
      if (storedProcessingId) {
        formData.append("processingId", storedProcessingId);
      }
      
      // get extracted resume text for selected document
      const resumeText = documents.find((doc) => doc.id === selectedDocument?.id)?.text || '';
      if (!resumeText) {
        setError("Could not parse resume! Try again!")
        return;
      }
      formData.set("resumeText", resumeText);
  
      // Create processing entry
      const response = await fetch('/api/resume/create', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        setError('Failed to initiate resume processing');
        return;
      }
  
      const { processingId } = await response.json();

      // Save the processingId for future reference
      if (processingId) {
        localStorage.setItem('currentResumeProcessingId', processingId);
      }
      
      // Redirect to processing status page
      router.push(`/builder/processing/${processingId}`);
  
    } catch (error) {
      setError(error as string);
      return false;
    }
    // formData.set("jobDescription", jobDescription);
    // formData.set("userCurrentSubscription", userCurrentSubscription as string);
    // // get extracted resume text for selected document
    // const resumeText = documents.find((doc) => doc.id === selectedDocument?.id)?.text || '';
    // if (!resumeText){
    //   setError("Could not parse resume! Try again!")
    //   return;
      
    // } 
    // formData.set("resumeText", resumeText)
    // try {
    //   return formAction(formData);
    // } catch (error) {
    //   setError(error as string);
    //   return false;
    // }
  };

  // Watch for state changes and redirect when we get a resume ID
  // useEffect(() => {
  //   if (state?.message) { // message contains the resume ID
  //     router.push(`/builder/${state.message}`);
  //   } else if (state.error) {
  //     setError(state.error);
  //   }
  // }, [state]);

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Selection</DialogTitle>
          <DialogDescription>
            Select a document and provide a job description link.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="document-select">Select or Upload a Resume</Label>
            <div className="flex items-center space-x-2">
              <div className="w-4/5">
                <Select
                  name="document"
                  value={selectedDocument?.id}
                  onValueChange={handleSelectFileChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem
                        key={doc.id}
                        value={doc.id}
                        textValue={doc.name}
                      >
                        {doc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-1/5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsUploadModalOpen(true)}
                  aria-label="Upload new document"
                  title="Upload a resume" // Added tooltip here
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="job-description-link">Job Description</Label>
            <Textarea
              id="job-description"
              aria-label="Job description"
              name="jobDescriptionLink"
              placeholder="Copy and paste the job description here"
              value={jobDescription}
              onChangeCapture={(e) => setJobDescription(e.currentTarget.value)}
            />
          </div>
          <DialogFooter>
            <SubmitButton
              className="w-full"
              pendingText="Generating..."
              disabled={!jobDescription || !newFile}
            >
              Generate
            </SubmitButton>
          </DialogFooter>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        {/* {state?.message && (
          <p className="text-sm text-green-500 mt-2">{state.message}</p>
        )} */}
      </DialogContent>
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Upload a new document. Only PDF and DOCX files are accepted.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="document-upload">Document</Label>
              <Input
                id="document-upload"
                type="file"
                accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
              {fileError && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {fileError}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpload} disabled={!newUploadFile || !!fileError}>
            {pendingText ? (
              <>
                Uploading...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Upload
              </>
            )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
