import { createClient } from "@/utils/supabase/server"
import { fetchUserUploadedFilesWithDetails, fetchUserCustomizedFilesWithDetails } from "@/lib/adapter/actions"
import DashboardView from "./dashboard-action"
import { encodedRedirect } from "@/utils/utils"
import { getUserRateLimit } from "@/lib/rate-limit"
import { UserDto } from "@/lib/dto/user"

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser() // Destructure directly to user
  if (!user) {
    console.error('User not logged in')
    return encodedRedirect("error", "/sign-in", "Login to continue");
  }

  // user current user package
  const { data: userCurrentSub, error: currentSubError } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", user.id)
    .single()

  const userId = user.id as string // Remove the extra user? check
  const fetchUserUploadedFiles = await fetchUserUploadedFilesWithDetails(userId as string)
  const fetchUserCustomizedFiles = await fetchUserCustomizedFilesWithDetails(userId as string)
  const getUserLimit = await getUserRateLimit(userId, "customize-resume")

  return (
    <>
      <DashboardView 
        UploadedUserFiles={fetchUserUploadedFiles} 
        CustomizedUserFiles={fetchUserCustomizedFiles} 
        user={user as UserDto} 
        // @ts-ignore
        rateLimit={getUserLimit} 
        userProfile={userCurrentSub}
        />
    </>
  )
}
