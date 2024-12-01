"use client"
import { signInAction, GoogleAuth } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FaGoogle } from "react-icons/fa";
import { useState } from 'react'; 
import { useToast } from "@/components/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";

const description =
  "A login form with email and password. There's an option to login with Google if you don't have an account."

export default function Login({ searchParams }: { searchParams: Message }) {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
  const { toast } = useToast();
  const supabase = createClient();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleInputChange = () => {
    setErrorMessage(null); // Clear error message when typing
  };

  // const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
  //   e.preventDefault();
  //   // Assume signIn is a function that handles the login logic
  //   const isValid = await signInAction(formData); // Replace with your login logic
  //   if (!isValid) {
  //     setErrorMessage('Invalid email or password'); // Set error message if invalid
  //   }
  // };
  const handleResendConfirmation = async () => {
    try {
      setIsResending(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "✅ Success",
          description: "Confirmation email has been resent. Please check your inbox.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Failed to resend confirmation email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const showResendButton = 'error' in searchParams ? searchParams?.error === 'Email not confirmed': '';

  return (
    <div className="flex w-full items-center justify-center md:ml-6 p-6">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showResendButton && (
            <Alert className="mb-4">
              <AlertTitle>Email not confirmed</AlertTitle>
              <AlertDescription className="mt-2">
                Please confirm your email address to continue.
                <Button 
                  variant="link" 
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  className="p-0 ml-2 h-auto font-semibold"
                >
                  {isResending ? 'Sending...' : 'Resend confirmation email'}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <div className="mb-4">
            <form>
              <SubmitButton 
                variant="outline" 
                className="w-full" 
                pendingText="Redirecting..." 
                formAction={GoogleAuth}
              >
                <FaGoogle className="mr-3 size-4"/>
                Login with Google
              </SubmitButton>
            </form>
          </div>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="forgot-password" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
        <Toaster />
      </Card>
    </div>
  );
}

