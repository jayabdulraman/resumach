import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
    try {
      const formData = await req.formData();
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      }
  
      // Check for existing processing ID first
      const existingProcessingId = formData.get('processingId') as string;
      if (existingProcessingId) {
        const { data: existingEntry, error: searchError } = await supabase
          .from('resume_processing')
          .select('id, status, resume_metadata_id')
          .eq('id', existingProcessingId)
          .single();
  
        if (!searchError) {
          // If there's an existing entry that's completed, return its resume
          if (existingEntry?.status === 'completed' && existingEntry?.resume_metadata_id) {
            return NextResponse.json({ 
              processingId: existingEntry.id,
              resumeId: existingEntry.resume_metadata_id,
              status: 'completed'
            });
          }
  
          // If there's an existing entry that's pending or processing, retry processing
          if (existingEntry?.status === 'pending' || existingEntry?.status === 'processing') {
            // Trigger background processing again in case it stalled
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/resume/process`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                processingId: existingEntry.id,
                jobDescription: formData.get('jobDescription'),
                resumeText: formData.get('resumeText'),
                userCurrentSubscription: formData.get('userCurrentSubscription')
              }),
            }).catch(console.error);
  
            return NextResponse.json({ 
              processingId: existingEntry.id,
              status: existingEntry.status 
            });
          }
        }
      }
  
      // Create new processing entry if no existing ID or previous one failed
      const { data: processingEntry, error: processingError } = await supabase
        .from('resume_processing')
        .insert({
          user_id: session.user.id,
          job_description: formData.get('jobDescription'),
          resume_text: formData.get('resumeText'),
          status: 'pending',
          metadata: {
            subscription_type: formData.get('userCurrentSubscription')
          }
        })
        .select()
        .single();
  
      if (processingError) throw processingError;
  
      // Trigger the background processing
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/resume/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          processingId: processingEntry.id,
          jobDescription: formData.get('jobDescription'),
          resumeText: formData.get('resumeText'),
          userCurrentSubscription: formData.get('userCurrentSubscription')
        }),
      }).catch(console.error);
  
      return NextResponse.json({ 
        processingId: processingEntry.id,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error initiating resume processing:', error);
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
  }