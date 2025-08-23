"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completeLogin = async () => {
      try {
        // Get the current authenticated user
        const user = await account.get();
        console.log("User authenticated:", user);

        // Call our API to handle user creation/retrieval
        const response = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to process authentication");
        }

        // Redirect based on onboarding status
        if (result.needsOnboarding) {
          router.replace(`/onboarding?uid=${result.user.$id}`);
        } else {
          router.replace("/dashboard");
        }
      } catch (err: any) {
        console.error("OAuth Callback Error:", err);
        setError(err.message || "Authentication failed");

        // Redirect to login after showing error
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    completeLogin();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Authentication Error
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <p className="mt-2 text-xs text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg font-medium text-gray-900">
          Completing authentication...
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
