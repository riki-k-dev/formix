"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldEllipsis,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
      });

      if (error) {
        setError(
          error.message || "Failed to reset password. Token might be expired.",
        );
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      <Grid />
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 w-full pt-25 md:pt-0">
        <div className="w-full max-w-300 flex flex-col border-x border-neutral-700/30 bg-[#0a0a0a] min-h-[calc(100vh-80px)]">
          <div className="flex-1 flex items-center justify-center p-6 md:p-20 lg:p-32 border-b border-neutral-700/30">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isSuccess ? (
                <div className="bg-[#050505] border border-neutral-800 p-10 rounded-2xl text-center shadow-2xl animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-2">
                    Password Reset!
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    Your password has been successfully updated. Redirecting you
                    to login...
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex w-full py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-neutral-200 transition-colors justify-center"
                  >
                    GO TO LOGIN
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-10">
                    <div className="border-zinc-800 border rounded-xl p-1 mb-6 bg-neutral-900/50 shadow-2xl">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
                        <ShieldEllipsis className="text-amber-400" size={24} />
                      </div>
                    </div>
                    <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
                      Set New Password
                    </h1>
                    <p className="text-sm text-neutral-500 font-mono text-center">
                      Please enter your new password below.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest font-mono">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={8}
                          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-4 pr-10 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest font-mono">
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={8}
                        className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-white/5"
                    >
                      {isLoading && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      UPDATE PASSWORD
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-300">
              <Separator />
            </div>
            <div className="w-full h-px bg-neutral-700/30"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
