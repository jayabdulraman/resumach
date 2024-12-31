"use client";
import { signUpAction, GoogleAuth } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Signup({ searchParams }: { searchParams: Message }) {
  const [loading, setLoading] = useState(false); // Add loading state
  const [loadingText, setLoadingText] = useState(""); // Add loading state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true);
    setLoadingText("Signing up...");
    // Create a new FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    // Append searchParams values to FormData
    const packageId = "packageId" in searchParams ? searchParams.packageId : "";

    if (packageId) {
      formData.append("packageId", packageId);
    }

    try {
      // Call the signUpAction with the modified FormData
      const response = await signUpAction(formData);
      // Handle the response (e.g., show success message, redirect, etc.)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error during sign up:", error);
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="flex w-full items-center justify-center md:p-10 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium underline"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {" "}
                {/* Add form element */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">
                    {loading ? (
                      <>
                        {loadingText}
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>Sign up</>
                    )}
                  </Button>
                  <FormMessage message={searchParams} />
                </div>
              </form>
              <form>
                <SubmitButton
                  variant="outline"
                  className="w-full"
                  pendingText="Redirecting..."
                  formAction={GoogleAuth}
                >
                  <FcGoogle className="mr-3 size-4" />
                  Sign up with Google
                </SubmitButton>
              </form>
              <br />
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 ">
            By signing up, you agree to our{" "}
            <a href="/terms-of-service" target="_blank" className="hover:text-primary">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy-policy" target="_blank" className="hover:text-primary">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
