"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Github,
  MailCheck,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Grid from "@/components/landing/ui/Grid";
import Separator from "@/components/landing/ui/Separator";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    setError(null);
    try {
      const { error } = await authClient.signIn.social({
        provider: provider,
        callbackURL: "/dashboard",
      });

      if (error) {
        setError(error.message || `Failed to login with ${provider}`);
        setSocialLoading(null);
      }
    } catch {
      setError(`An error occurred while connecting to ${provider}.`);
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });

        if (error) {
          setError(
            error.message ||
              "Invalid email or password. If you just signed up, please verify your email.",
          );
          setIsLoading(false);
          return;
        }

        router.push("/dashboard");
        router.refresh();
      } else {
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

        // Signup successful, email sent
        setVerificationSent(true);
        setIsLoading(false);
      }
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
              {/* Show this screen if verification email is sent */}
              {verificationSent ? (
                <div className="bg-[#050505] border border-neutral-800 p-10 rounded-2xl text-center shadow-2xl animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 mb-6">
                    <MailCheck className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-medium text-white mb-2">
                    Check your email
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    We&apos;ve sent a verification link to{" "}
                    <strong className="text-white">{email}</strong>. Please
                    click the link to activate your account.
                  </p>
                  <button
                    onClick={() => {
                      setVerificationSent(false);
                      setIsLogin(true);
                    }}
                    className="w-full py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    RETURN TO LOGIN
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex flex-col items-center mb-10">
                    <div className="border-zinc-800 border rounded-xl p-1 mb-6 bg-neutral-900/50 shadow-2xl">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center">
                        <Sparkles className="text-amber-400" size={24} />
                      </div>
                    </div>
                    <h1 className="text-3xl font-mono tracking-tight text-white mb-2">
                      {isLogin ? "Welcome back" : "Join Formix"}
                    </h1>
                    <p className="text-sm text-neutral-500 font-mono text-center">
                      {isLogin
                        ? "Enter your credentials or use social login"
                        : "Start building AI-powered headless forms today"}
                    </p>
                  </div>

                  {/* SOCIAL LOGIN BUTTONS */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("google")}
                      disabled={!!socialLoading || isLoading}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white hover:bg-neutral-800 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {socialLoading === "google" ? (
                        <Loader2
                          size={18}
                          className="animate-spin text-neutral-400"
                        />
                      ) : (
                        <FcGoogle size={18} />
                      )}
                      <span className="font-medium group-hover:text-white text-neutral-300">
                        Google
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("github")}
                      disabled={!!socialLoading || isLoading}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white hover:bg-neutral-800 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {socialLoading === "github" ? (
                        <Loader2
                          size={18}
                          className="animate-spin text-neutral-400"
                        />
                      ) : (
                        <Github size={18} className="text-white" />
                      )}
                      <span className="font-medium group-hover:text-white text-neutral-300">
                        GitHub
                      </span>
                    </button>
                  </div>

                  <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-neutral-800"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#0a0a0a] px-2 text-neutral-600 font-mono">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* EMAIL/PASS FORM */}
                  <div className="bg-transparent">
                    {error && (
                      <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={16} className="shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                        <div className="space-y-1.5">
                          <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest font-mono">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required={!isLogin}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest font-mono">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest font-mono">
                            Password
                          </label>
                          {isLogin && (
                            <Link
                              href="#"
                              className="text-[10px] uppercase font-bold text-neutral-600 hover:text-neutral-400 transition-colors"
                            >
                              Forgot?
                            </Link>
                          )}
                        </div>
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

                      <button
                        type="submit"
                        disabled={isLoading || !!socialLoading}
                        className="w-full mt-6 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-white/5"
                      >
                        {isLoading && (
                          <Loader2 size={16} className="animate-spin" />
                        )}
                        {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                      </button>
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-sm text-neutral-500 font-mono">
                        {isLogin
                          ? "Don't have an account?"
                          : "Already have an account?"}{" "}
                        <button
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                          }}
                          className="text-white hover:underline underline-offset-4 transition-all font-medium cursor-pointer"
                        >
                          {isLogin ? "Sign up" : "Sign in"}
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* BOTTOM DECORATION */}
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
