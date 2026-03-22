// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Sparkles, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setError(error.message || "Invalid email or password");
          setIsLoading(false);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } else {
        // Handle Signup
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (error) {
          setError(error.message || "Something went wrong during signup");
          setIsLoading(false);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="border-zinc-800 border rounded-xl p-1 mb-4 bg-neutral-900/50 shadow-2xl">
            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
              <Sparkles className="text-amber-400" size={24} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {isLogin ? "Welcome back to Formix" : "Create your Formix account"}
          </h1>
          <p className="text-sm text-neutral-400">
            {isLogin
              ? "Enter your credentials to access your dashboard"
              : "Start building AI-powered headless forms today"}
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-neutral-400">
                    Password
                  </label>
                  {isLogin && (
                    <Link
                      href="#"
                      className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                {/* Updated Password Field with Eye Icon */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg pl-3 pr-10 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-2.5 bg-white text-black font-medium text-sm rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-900/30 text-center">
            <p className="text-sm text-neutral-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-white hover:underline transition-all font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-8">
          By continuing, you agree to Formix&apos;s Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
}
