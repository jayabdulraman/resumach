"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sampleResume } from "@/utils/schema/sample";
import { createClient as serviceRoleClient } from '@supabase/supabase-js';
import { createCheckoutSession } from "@/lib/adapter/actions";
import { useAuthStore } from "@/utils/stores/auth";


export async function fetchResume() {
  try {

    const resume = sampleResume

    return resume;
  } catch {
    return redirect("/dashboard");
  }
}
export async function signUpAction (formData: FormData){
  const name = formData.get("name") as string;
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const packageId = formData.get("packageId")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    console.log("ERROR:", error)
    return encodedRedirect("error", "/sign-up", error.message);
  }
  else {
    if (packageId) {
      const originPath = "signup"
      await createCheckoutSession(packageId, originPath)
    } else {

      console.log("RUNNING FREE USER:", data.user?.id)

      // 2. Create pending upgrade record
      const { data: credit_packages, error: packageError } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('name', 'Free')
        .single()

      if (packageError) throw packageError

      const { error: pendingError } = await supabase
        .from('pending_upgrades')
        .insert({
          user_id: data.user?.id,
          package_id: credit_packages.id,
          status: 'completed',
        });
        
      if (pendingError) throw pendingError;

      return encodedRedirect(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  }
};

export async function signInAction (formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  
  return redirect("/dashboard");
};

export async function GoogleAuth() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  })
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  } else if (error) {
    console.error("Error during Google authentication:", error.message);
    return encodedRedirect("error", "/sign-in", error.message);
  }
  
};

export async function forgotPasswordAction (formData: FormData) {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      error.message,
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export async function resetPasswordAction (formData: FormData) {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/settings",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/settings",
      "Passwords do not match",
    );
  }
  console.log("Updating password...")
  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.log("PASSWORD UPDATE ERROR:", error)
    return encodedRedirect(
      "error",
      "/settings",
      error.message,
    );
  }

  encodedRedirect("success", "/settings", "Password is successfully updated!");
};

export async function signOutAction(){
  const supabase = createClient();
  await supabase.auth.signOut();
  useAuthStore.setState({user: null, userCurrentSubscription: null})
  return redirect("/sign-in");
};

export async function deleteUserAction() {
  // supabase client
  const supabase = createClient();
  // supabase service_role client
  const serviceClient = serviceRoleClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.log("User retrieval error:", userError);
    return encodedRedirect("error", "/settings", "User not found or not authenticated.");
  }

  // 1. List all objects in the user's folder
  const { data: objects, error: listError } = await serviceClient.storage
  .from('resume-files')
  .list(user.id, {
    // Optional: Adjust the options as needed
    limit: 1000, // Maximum number of objects per request
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (listError) {
    console.log("Error listing objects:", listError);
  }
  // @ts-ignore
  if (objects?.length >= 1) {
    // 2. Prepare the list of object keys to delete
    const objectKeys = objects?.map(obj => `${user.id}/${obj.name}`);

    // Delete user objects first
    const { error: deleteObjectsError } = await serviceClient.storage
        .from('resume-files')
        .remove(objectKeys as string[]);
    
    if (deleteObjectsError) {
      console.log("USER OBJECTS DELETION ERROR:", deleteObjectsError);
      return encodedRedirect("error", "/settings", deleteObjectsError.message);
    }
  }
  // Delete the user
  const { error: deleteError } = await serviceClient.auth.admin.deleteUser(user.id);
  
  if (deleteError) {
    console.log("USER DELETION ERROR:", deleteError);
    encodedRedirect("error", "/settings", deleteError.message);
  }

  // Sign out the user and set states null
  useAuthStore.setState({user: null, userCurrentSubscription: null})
  await supabase.auth.signOut();
  
  encodedRedirect("success", "/sign-in", "Your account has been successfully deleted!");
};
