import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProcessingStatus } from "./processing-status";

export default async function ProcessingPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?next=login-to-continue');
  }

  // Check initial status
  const { data: processing, error } = await supabase
    .from('resume_processing')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !processing) {
    redirect('/dashboard');
  }

  // If already completed, redirect to the builder
  if (processing.status === 'completed' && processing.resume_metadata_id) {
    redirect(`/builder/${processing.resume_metadata_id}`);
  }

  return (
    <div className="container mx-auto py-8">
      <ProcessingStatus processingId={id} />
    </div>
  );
}