import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractTextAndKeywords } from "@/lib/adapter/actions";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const JWT = req.headers.get('Authorization')?.split(' ')[1] || '';
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
        auth: {persistSession: false,autoRefreshToken: false,},
        global: { headers: { Authorization: `Bearer ${JWT}` } } 
    }
  );
  //const supabase = createClient();
  const { processingId, jobDescription, resumeText, userCurrentSubscription } = await req.json();
  
  try {
    // Update status to processing
    console.log("PROCESSING RESUME...")
    await supabase
      .from('resume_processing')
      .update({ status: 'processing' })
      .eq('id', processingId);

    // Process the resume
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('resumeText', resumeText);
    formData.append('userCurrentSubscription', userCurrentSubscription);

    const result = await extractTextAndKeywords({'jwt': JWT}, formData);

    if ('error' in result) {
      await supabase
        .from('resume_processing')
        .update({ 
          status: 'failed',
          error_message: result.error,
          completed_at: new Date().toISOString()
        })
        .eq('id', processingId);

      return NextResponse.json({ status: 'failed', error: result.error });
    }

    // Update processing entry with success and link to created resume
    await supabase
      .from('resume_processing')
      .update({ 
        status: 'completed',
        resume_metadata_id: result.message, // Assuming this is the resume ID
        completed_at: new Date().toISOString()
      })
      .eq('id', processingId);

    return NextResponse.json({ 
      status: 'completed', 
      resumeId: result.message 
    });

  } catch (error) {
    console.error('Processing error:', error);
    
    await supabase
      .from('resume_processing')
      .update({ 
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString()
      })
      .eq('id', processingId);

    return NextResponse.json(
      { error: 'Resume processing failed' },
      { status: 500 }
    );
  }
}