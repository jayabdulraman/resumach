"use server";
import OpenAI from "openai";
import { ResumeSchema } from "@/utils/resumeZodSchema";
import { zodResponseFormat } from "openai/helpers/zod";
import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ResumeDto } from "../dto/resume";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { stripe } from '../stripe'
import { createClient as serviceRoleClient } from '@supabase/supabase-js';
import { encodedRedirect } from "@/utils/utils";
import { defaultMetadata } from "@/utils/schema";
import { createId } from "@paralleldrive/cuid2";
import { UUID } from "crypto";

interface pdfData {
  text: string;
  Title: string;
  pageData: [];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
});

export async function extractKeywordsFromJobDescription(
  jobDescription: string
): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You're an expert in extracting job-related keywords and action verbs from a Job description text. \n
                  You are to only use the jobDescription provided below. \n
                  Do not add keywords that are not in the job desciption. \n
                  Only extract unique keywords and action verbs without duplicating or similar in meaning. \n
                  jobDescription: ${jobDescription}\n
                  Here's a definition of the key terms:\n
                  job-related-keywords: description of the ideal candidate's primary skills (both hard and soft), and core qualifications for the job e.g Critical thinking, Python, Team collaboration, Photoshop etc.\n
                  action-verbs: words that demonstrate action(s) of the ideal candidate in their career so far. eg managed, developed, planned, designed etc.\n

                  Your response should be in the format:
                  keywords = {
                    job-related-keywords: [comma-seperated values],
                    action-verbs: [comma-seperated values]
                  }Å
                `,
      },
      {
        role: "user",
        content: `Extract up to 10 job-related keywords and action verbs from the job description respectively`,
      },
    ],
    max_tokens: 100,
    temperature: 0.5,
  });

  return response.choices[0].message.content;
}

export async function generateFileName(jobDescriptionText: string) {
  const sysPrompt = ` You are an expert in generating file names for job descriptions. Given the job description, extract the job title and company name and merge them to form a file name. 
    Example for a "Software Engineer at Google", the file name is: "software-engineer-google". Now do the same for the following job description and return just the file name.

    Job Description:
    ${jobDescriptionText}\n

    File name:`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: sysPrompt,
        },
        {
          role: "user",
          content: `Generate a file name for the job description provided.`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.8,
    });
    const fileName = response.choices[0].message.content
    return fileName;
}

export async function extractTextAndKeywords(
  prevState: any,
  formData: FormData
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const jobDescription = formData.get("jobDescription");
  const resumeText = formData.get("resumeText");
  const userId = user?.id as string
  const userCurrentSubscription = formData.get("userCurrentSubscription");
  const startTime = Date.now(); // Start timer
  const keywords = await extractKeywordsFromJobDescription(jobDescription as string);

  const system_prompt = `
      You are an expert in tailoring resumes to match job description and their keywords.
      Given the job description and the following keywords, tailor the Resume to emphasize relevant skills and experience, 
      including relevant job-related keywords.
      Follow further instructions below:
      - Add a one sentence summary of the candidate relevant to the job.
      - Divide the skills into relevant categories based on domain of job, and add any missing skills from the job description. 
      - Tailor the experience accomplishments in this format: 'Accomplished [X], as measured by [Y], by doing [Z],' ensuring clarity and conciseness. MAINTAIN any impact stats provided from the candidate's resume.
      - Only add experience, projects, skills, certifications or awards that are relevant to the job description.
      - Do not use any markdown formatting in the response.
      - DO NOT add information that is not provided in the keywords, job description, and resume.
      - If there is only one date in Education or Experience sections, use it as the end date.\n

      Job Description Keywords: ${keywords}\n

      Job Description:
      ${jobDescription}\n

      Resume:
      ${resumeText}\n

      Adapted Resume: `;

    // define variable to hold parsed resume
    let adaptedResponse;

    try {
      // Call GPT-4o to generate the adapted resume
      const response = await openai.beta.chat.completions.parse({
          model: 'gpt-4o-mini',
          messages: [
              {
              "role": "system",
              "content": [
                  {
                  "type": "text",
                  "text": system_prompt
                  }
              ]
              },
              {
              "role": "user",
              "content": [
                  {
                  "type": "text",
                  "text": "Tailor my resume to match the job description and keywords."
                  }
              ]
              }
          ],
          max_tokens: 1500,
          temperature: 0.5,
          response_format: zodResponseFormat(ResumeSchema, "adaptedResume")
      });

      const tailoredResponse = response.choices[0].message
      if (tailoredResponse.parsed) {
        adaptedResponse = tailoredResponse.parsed
      } else if (tailoredResponse.refusal) {
        return {
          error: tailoredResponse.refusal
        }
      }

    } catch (e) {
      // Handle edge cases
      // @ts-ignore
      if (e.constructor.name == "LengthFinishReasonError") {
        // Retry with a higher max tokens
        // @ts-ignore
        console.log("Too many tokens: ", e);
        return {
          // @ts-ignore
          error: e.message
        }
      } else {
        // Handle other exceptions
        // @ts-ignore
        console.log("An error occurred: ", e.message);
        return {
          // @ts-ignore
          error: e.message
        }
      }
    }

    // generate fileName
    const fileName = await generateFileName(jobDescription as string) as string;
    // get tailored resume
    //const adaptedResponse = response.choices[0].message.parsed;
    const contructResumeData = {
      basics: {
        name: adaptedResponse?.name as string, 
        headline: adaptedResponse?.headline as string, 
        phone: adaptedResponse?.phone as string, 
        email: adaptedResponse?.email as string, 
        location: adaptedResponse?.location as string, 
        url: adaptedResponse?.website
      },
      sections: {
        summary: {name: "Summary", identifier: 'summary', visible: true, content: adaptedResponse?.summary},
        awards: {name: "Awards", identifier: "awards", visible: true, items: adaptedResponse?.award && adaptedResponse.award.length > 0 
          ? adaptedResponse.award.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.award is empty, return an empty array},
        },
        certifications:{name: "Certifications", identifier: "certifications", visible: true, items: adaptedResponse?.certification && adaptedResponse.certification.length > 0 
          ? adaptedResponse.certification.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.certification is empty, return an empty array},
        },
        education: {name: "Education", identifier: "education", visible: true, items: adaptedResponse?.education && adaptedResponse.education.length > 0 
          ? adaptedResponse.education.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.education is empty, return an empty array},
        },
        experience: {name: "Experience", identifier: "experience", visible: true, items: adaptedResponse?.experience && adaptedResponse.experience.length > 0 
          ? adaptedResponse.experience.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.experience is empty, return an empty array},
        },
        volunteer: {name: "Volunteering", identifier: "volunteer", visible: true, items: adaptedResponse?.volunteer && adaptedResponse.volunteer.length > 0 
          ? adaptedResponse.volunteer.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.volunteer is empty, return an empty array},
        },
        profiles: {name: "Profiles", identifier: "profiles", visible: true, items: adaptedResponse?.profile && adaptedResponse.profile.length > 0 
          ? adaptedResponse.profile.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.profile is empty, return an empty array},
        },
        projects: {name: "Projects", identifier: "projects", visible: true, items: adaptedResponse?.project && adaptedResponse.project.length > 0 
          ? adaptedResponse.project.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.award is empty, return an empty array},
        },
        publications: {name: "Publications", identifier: "publications", visible: true, items: adaptedResponse?.publication && adaptedResponse.publication.length > 0 
          ? adaptedResponse.publication.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.publication is empty, return an empty array},
        },
        references: {name: "References", identifier: "references", visible: true, items: adaptedResponse?.reference && adaptedResponse.reference.length > 0 
          ? adaptedResponse.reference.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.reference is empty, return an empty array},
        },
        skills: {name: "Skills", identifier: "skills", visible: true, items:adaptedResponse?.skill && adaptedResponse.skill.length > 0 
          ? adaptedResponse.skill.map((item) => ({
              ...item, // Spread the existing properties
              id: createId(), // Add a unique ID
              visible: true,
            }))
          : [], // If adaptedResponse?.skill is empty, return an empty array},
        },
        custom: {},
      },
      metadata: defaultMetadata,
    }

    // create and save resume data
    // const data = await fetchResume();
    const resume: ResumeDto = {
      title: fileName,
      slug: fileName,
      //@ts-ignore
      data: contructResumeData,
      visibility: "public",
      locked: false,
      userId: user?.id as string,
    };
    
    const createResumeDataResponse = await createResumeAction({ jwt: prevState.jwt }, resume);
    // update usage
    if (userCurrentSubscription !== "Free") {
      const {data: getUserUsageData, error: usageError} = await supabase
        .from("user_credits")
        .select("*").eq("user_id", userId).single()
      
      if (getUserUsageData) {
        if (getUserUsageData.total_credits_earned === getUserUsageData.total_credits_used) {
          // if user hits pro usage credit limit, downgrade to "Free" version
          const {error: updateProfileError} = await supabase
          .from("user_profile")
          .update({
            current_subscription_type: "Free",
            updated_at: new Date().toISOString()
          }).eq("user_id", userId)
        } else {
          // update credit usage for specific user
          const creditsUsed = Number(getUserUsageData.total_credits_used) + 1
          const availableCredit = Number(getUserUsageData.available_credits) - 1
       
          const {data: updateUsage, error: updateUsageError} = await supabase
          .from("user_credits")
          .update({
            available_credits: availableCredit,
            total_credits_used: creditsUsed,
            updated_at: new Date().toISOString()
          }).eq("user_id", userId).select().single()

          if (updateUsage[0].total_credits_earned === updateUsage[0].total_credits_used) {
            const {error: updateError} = await supabase
            .from("user_profile")
            .update({
              current_subscription_type: "Free",
              updated_at: new Date().toISOString()
            }).eq("user_id", userId)
          }
        }
      }
    }
    const endTime = Date.now(); // End timer
    const duration = endTime - startTime; // Duration in milliseconds
    const minutes = Math.floor(duration / 1000 / 60); // Convert to minutes
    const seconds = Math.floor((duration / 1000) % 60); // Remaining seconds
    console.log(`Time taken: ${minutes} minutes and ${seconds} seconds`);

    return {
      message: createResumeDataResponse.id as string,
    };
}

type FileData = {
  id: string;
  owner: string;
  fileName: string;
  fileUrl: string;
  dateModified: string;
  fileSize: number; // Adjust type as necessary
  fileType: string;
  resume: ResumeDto;
  extractedText?: string;
};

export async function fetchUserUploadedFilesWithDetails(
  userId: string
): Promise<FileData[]> {
  const supabase = createClient();
  const folderPath = `${userId}/`; // Define the folder path

  // Fetch files from the user's folder in the "resume-files" bucket
  const { data: files, error: fetchError } = await supabase.storage
    .from("resume-files")
    .list(folderPath);

  if (fetchError) {
    console.error("Error fetching files:", fetchError);
    return [];
  }

  if (!files) {
    return [];
  }

  // Match files with their details
  // @ts-ignore
  const fileDetails: FileData[] = await Promise.all(
    files.map(async (file) => {
      const { data: urlData } = supabase.storage
        .from("resume-files")
        .getPublicUrl(`${folderPath}${file.name}`);

      const {data: textRetrieval, error } = await supabase
        .from("document_content")
        .select('extracted_text')
        .eq('file_id', file.id)
        .single()
      
      if (error) {
      }

      return {
        id: file.id,
        owner: userId,
        fileName: file.name,
        fileUrl: urlData.publicUrl,
        dateModified: file.updated_at,
        fileSize: file.metadata.size,
        fileType: file.metadata.mimetype,
        resume: {},
        extractedText: textRetrieval?.extracted_text
      };
    })
  ); // Filter out any unmatched files
  fileDetails.sort((a, b) => new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime());
  return fileDetails;
}

export async function fetchUserCustomizedFilesWithDetails(
  userId: string
): Promise<FileData[]> {
  const supabase = createClient();

  // Fetch resume metadata for the user
  const { data: resumeMetadata, error: metadataError } = await supabase
    .from('resume_metadata')
    .select('*')
    .eq('user_id', userId);

  if (metadataError) {
    console.error("Error fetching resume metadata:", metadataError);
    return [];
  }

  if (!resumeMetadata?.length) {
    return [];
  }

  // Fetch detailed resume data for each metadata entry
  const resumeDetails = await Promise.all(
    resumeMetadata.map(async (metadata) => {
      const { data: resumeData, error: dataError } = await supabase
        .from('resume_data')
        .select('*')
        .eq('id', metadata.data)
        .single();

      if (dataError) {
        console.error(`Error fetching resume data for metadata ${metadata.data}:`, dataError);
        return null;
      }

      if (!resumeData) {
        console.error(`No resume data found for metadata ${metadata.data}`);
        return null;
      }

      const resume: ResumeDto = {
        id: metadata.id,
        title: metadata.title,
        slug: metadata.slug,
        data: resumeData,
        visibility: metadata.visibility,
        locked: metadata.locked,
        userId: metadata.user_id,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt,
      }

      return {
        id: metadata.id,
        owner: userId,
        fileName: metadata.title || '',
        dateModified: metadata.updatedAt,
        fileSize: 0,
        fileType: 'json',
        resume: resume,
      };
    })
  );
  resumeDetails.sort((a, b) => new Date(b?.dateModified).getTime() - new Date(a?.dateModified).getTime());
  // Filter out any null entries from failed fetches
  return resumeDetails.filter((detail): detail is FileData => detail !== null);
}

export async function getResume (resumeId: string, userId: string) {
  const supabase = createClient();
  // Fetch both metadata and resume data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (userId !== user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const { data: metadata, error: metadataError } = await supabase
      .from("resume_metadata")
      .select("*")
      .eq("id", resumeId)
      .single();

    if (metadataError) throw metadataError;

    const { data: resumeData, error: dataError } = await supabase
      .from("resume_data")
      .select("*")
      .eq("id", metadata.data)
      .single();

    if (dataError) throw dataError;

    const dataDeconstruct = {
      basics: resumeData.basics,
      sections: {
        summary: resumeData.summary,
        awards: resumeData.awards,
        certifications: resumeData.certifications,
        education: resumeData.education,
        experience: resumeData.experience,
        volunteer: resumeData.volunteer,
        profiles: resumeData.profiles,
        projects: resumeData.projects,
        publications: resumeData.publications,
        references: resumeData.references,
        skills: resumeData.skills,
        custom: resumeData.custom,
      },
      metadata: resumeData.metadata,
    };

    const resume: ResumeDto = {
      id: metadata.id,
      title: metadata.title,
      slug: metadata.slug,
      data: dataDeconstruct,
      visibility: metadata.visibility,
      locked: metadata.locked,
      userId: metadata.user_id,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
    };

    return resume;
  } catch (error) {
    return error;
  }
};

export async function getPublicResume (resumeId: string) {
  const supabase = createClient();
  
  try {
    const { data: metadata, error: metadataError } = await supabase
      .from("resume_metadata")
      .select("*")
      .eq("id", resumeId)
      .single();

    if (metadataError) throw metadataError;

    const { data: resumeData, error: dataError } = await supabase
      .from("resume_data")
      .select("*")
      .eq("id", metadata.data)
      .single();

    if (dataError) throw dataError;

    const dataDeconstruct = {
      basics: resumeData.basics,
      sections: {
        summary: resumeData.summary,
        awards: resumeData.awards,
        certifications: resumeData.certifications,
        education: resumeData.education,
        experience: resumeData.experience,
        volunteer: resumeData.volunteer,
        profiles: resumeData.profiles,
        projects: resumeData.projects,
        publications: resumeData.publications,
        references: resumeData.references,
        skills: resumeData.skills,
        custom: resumeData.custom,
      },
      metadata: resumeData.metadata,
    };

    const resume: ResumeDto = {
      id: metadata.id,
      title: metadata.title,
      slug: metadata.slug,
      data: dataDeconstruct,
      visibility: metadata.visibility,
      locked: metadata.locked,
      userId: metadata.user_id,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
    };

    return resume;
  } catch (error) {
    return error;
  }
};

export async function createResumeAction (prevState:any, resumeData: ResumeDto) {

  try {
    if (prevState.jwt) {
      // doing this because edge function cannot access cookies for JWT which you need to access current logged-in user
      const supabaseClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { 
            auth: {persistSession: false,autoRefreshToken: false,},
            global: { headers: { Authorization: `Bearer ${prevState.jwt}` } } 
        }
      );
      // Get current user
      const {data: { user }, error: userError} = await supabaseClient.auth.getUser(prevState.jwt);

      if (userError || !user) {
        console.log("AUTH ERROR:", userError);
        throw new Error("User not authenticated");
      }

      // First insert the resume data into resume_data table
      const { data: resumeDataRecord, error: dataError } = await supabaseClient
        .from("resume_data")
        .insert({
          basics: resumeData.data.basics,
          summary: resumeData.data.sections.summary,
          education: resumeData.data.sections.education,
          experience: resumeData.data.sections.experience,
          skills: resumeData.data.sections.skills,
          projects: resumeData.data.sections.projects,
          profiles: resumeData.data.sections.profiles,
          awards: resumeData.data.sections.awards,
          certifications: resumeData.data.sections.certifications,
          volunteer: resumeData.data.sections.volunteer,
          publications: resumeData.data.sections.publications,
          references: resumeData.data.sections.references,
          custom: resumeData.data.sections.custom,
          metadata: resumeData.data.metadata,
        })
        .select()
        .single();

      if (dataError) {
        throw new Error(`Error inserting resume data: ${dataError.message}`);
      }

      // Insert metadata into resume_metadata table
      const { data: metadataRecord, error: metadataError } = await supabaseClient
        .from("resume_metadata")
        .insert({
          title: resumeData.title,
          slug: resumeData.slug,
          visibility: resumeData.visibility,
          locked: resumeData.locked,
          user_id: user.id,
          data: resumeDataRecord.id, // Reference to resume_data
        })
        .select()
        .single();

      if (metadataError) {
        throw new Error(
          `Error inserting resume metadata: ${metadataError.message}`
        );
      }

      return metadataRecord;
    }
    // Get current user by accessing jwt from cookies
    const supabase = createClient();
    const {data: { user }, error: userError} = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

    // First insert the resume data into resume_data table
    const { data: resumeDataRecord, error: dataError } = await supabase
      .from("resume_data")
      .insert({
        basics: resumeData.data.basics,
        summary: resumeData.data.sections.summary,
        education: resumeData.data.sections.education,
        experience: resumeData.data.sections.experience,
        skills: resumeData.data.sections.skills,
        projects: resumeData.data.sections.projects,
        profiles: resumeData.data.sections.profiles,
        awards: resumeData.data.sections.awards,
        certifications: resumeData.data.sections.certifications,
        volunteer: resumeData.data.sections.volunteer,
        publications: resumeData.data.sections.publications,
        references: resumeData.data.sections.references,
        custom: resumeData.data.sections.custom,
        metadata: resumeData.data.metadata,
      })
      .select()
      .single();

    if (dataError) {
      throw new Error(`Error inserting resume data: ${dataError.message}`);
    }

    // Insert metadata into resume_metadata table
    const { data: metadataRecord, error: metadataError } = await supabase
      .from("resume_metadata")
      .insert({
        title: resumeData.title,
        slug: resumeData.slug,
        visibility: resumeData.visibility,
        locked: resumeData.locked,
        user_id: user.id,
        data: resumeDataRecord.id, // Reference to resume_data
      })
      .select()
      .single();

    if (metadataError) {
      throw new Error(
        `Error inserting resume metadata: ${metadataError.message}`
      );
    }

    return metadataRecord;
  } catch (error) {
    console.error("Error creating resume:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export type UpdateResumeResponse = {
  success: boolean;
  error?: string;
  resume?: ResumeDto;
};

export async function updateResumeAction(
  userId: string,
  resumeId: string,
  resume: Partial<ResumeDto>
): Promise<UpdateResumeResponse> {
  try {
    const supabase = createClient();
    
    // Verify authentication and ownership
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user || auth.user.id !== userId) {
      return { success: false, error: 'Unauthorized access' };
    }

    // Verify resume ownership
    const { data: existingResume } = await supabase
      .from('resume_metadata')
      .select('user_id')
      .eq('id', resumeId)
      .single();

    if (!existingResume || existingResume.user_id !== userId) {
      return { success: false, error: 'Resume not found or access denied' };
    }

    // Start a transaction for atomic updates
    const { data: updatedMetadata, error: metadataError } = await supabase
      .from('resume_metadata')
      .update({
        title: resume.title,
        slug: resume.slug,
        visibility: resume.visibility,
        locked: resume.locked,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .select()
      .single();

    if (metadataError) {
      throw new Error(metadataError.message);
    }
    // Update resume data if it exists in the update payload
    if (resume.data) {
      const { error: dataError } = await supabase
        .from('resume_data')
        .update({ 
          basics: resume.data.basics,
          summary: resume.data.sections.summary,
          education: resume.data.sections.education,
          experience: resume.data.sections.experience,
          skills: resume.data.sections.skills,
          projects: resume.data.sections.projects,
          profiles: resume.data.sections.profiles,
          awards: resume.data.sections.awards,
          certifications: resume.data.sections.certifications,
          volunteer: resume.data.sections.volunteer,
          publications: resume.data.sections.publications,
          references: resume.data.sections.references,
          metadata: resume.data.metadata,
          custom: resume.data.sections.custom,
          updateAt: new Date().toISOString(),
        })
        .eq('id', updatedMetadata.data)
        .select()
        .single();

      if (dataError) {
        throw new Error(dataError.message);
      }
    }

    revalidatePath(`/builder/${resumeId}`);
    return { success: true, resume: updatedMetadata };

  } catch (error) {
    console.error('Error updating resume:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update resume' 
    };
  }
}

export async function deleteResumeAction (resumeId: string, userId: string) {
  const supabase = createClient();
  // Fetch the resume metadata to check ownership
  const { data: metadata, error: metadataError } = await supabase
    .from('resume_metadata')
    .select('*')
    .eq('id', resumeId)
    .single();

  if (metadataError) {
    console.error("Error fetching resume metadata:", metadataError);
    return { success: false, error: 'Failed to fetch resume metadata' };
  }

  // Check if the user is authenticated and owns the resume
  if (!metadata || metadata.user_id !== userId) {
    return { success: false, error: 'Unauthorized or resume not found' };
  }

  // Proceed to delete the resume
  const { error: deleteResumeMetadataError } = await supabase
    .from('resume_metadata')
    .delete()
    .eq('id', resumeId);

  const { error: deleteResumeDataError } = await supabase
    .from('resume_data')
    .delete()
    .eq('id', metadata.data);

  if (deleteResumeMetadataError || deleteResumeDataError) {
    console.error("Error deleting resume:", deleteResumeMetadataError || deleteResumeDataError);
    return { success: false, error: 'Failed to delete resume' };
  }

  revalidatePath(`/dashboard`);
};

export async function deleteUploadedFileAction (fileId: string, filename: string, userId: string) {
  const supabase = createClient();
  const { data: { user }} = await supabase.auth.getUser();
  // supabase service_role client
  const serviceClient = serviceRoleClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  
  if (user?.id === userId) {
    // Delete user objects first
    const { data, error: deleteObjectsError } = await serviceClient.storage
    .from('resume-files')
    .remove([`${userId}/${filename}`])

    if (deleteObjectsError) {
      return encodedRedirect("error", "/dashboard", deleteObjectsError.message);
    }

    // const Delete the extracted content of resume as well
    const {error: deleteContentError} =  await supabase
      .from("document_content")
      .delete()
      .eq("file_id", fileId)

    if (deleteContentError) {
      return encodedRedirect("error", "/dashboard", deleteContentError.message);
    }
  }
   
  return
};

async function getOrCreateStripeCustomer(email: string): Promise<string> {
  try {
    // Search for existing customer
    const customers = await stripe.customers.list({ email: email, limit: 1 });

    if (customers.data.length > 0) {
      // Customer found, return their ID
      return customers.data[0].id;
    } else {
      // No customer found, create a new one
      const newCustomer = await stripe.customers.create({ email: email });
      return newCustomer.id;
    }
  } catch (error) {
    console.error('Error in getOrCreateCustomer:', error);
    throw error;
  }
}

type UserDetails = {
  id: string;
  email: string | undefined;
};

export async function createCheckoutSession(packageId: string, originPath="non-signup", user: UserDetails) {
  const supabase = createClient()
  
  // const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Get package details from database
  const { data: credit_packages } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', packageId)
    .single()
  
  if (!credit_packages) throw new Error('Package not found')
  // get unit amount in cents
  const unit_price = Math.round(credit_packages.price * 100);

  // Get or create customer ID
  const customerId = await getOrCreateStripeCustomer(user.email as string);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${credit_packages.credits} Credits`,
          description: credit_packages.description,
        },
        unit_amount: unit_price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: originPath === "non-signup" ? `${process.env.NEXT_PUBLIC_BASE_URL ?? `https://resumach.com`}/dashboard?success=true` : `${process.env.NEXT_PUBLIC_BASE_URL ?? `https://resumach.com`}/sign-up?success=Thanks for signing up! Please check your email for a verification link.`,
    cancel_url: originPath === "non-signup" ? `${process.env.NEXT_PUBLIC_BASE_URL ?? `https://resumach.com`}/dashboard?canceled=true` : `${process.env.NEXT_PUBLIC_BASE_URL ?? `https://resumach.com`}/sign-up?error=Error with payment, please try again!`,
    customer: customerId,
    client_reference_id: user.id.toString(),
    metadata: {
      userId: user.id as UUID,
      packageId: packageId as UUID,
      credits: credit_packages.credits as number,
      amount: credit_packages.price as number,
      package_name: credit_packages.name,
    },
  })

  if (!session.url) throw new Error('Failed to create session')

  redirect(session.url)
}