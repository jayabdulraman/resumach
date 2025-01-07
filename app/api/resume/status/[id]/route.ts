import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('resume_processing')
      .select('status, error_message, resume_metadata_id')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json({
      status: data.status,
      error: data.error_message,
      resumeId: data.resume_metadata_id
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resume status' },
      { status: 500 }
    );
  }
}