"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield, Users, Building2, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"member" | "provider" | "employer">("member");
  
  // Read type from URL query param
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "provider" || type === "employer" || type === "member") {
      setUserType(type);
    }
  }, [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portalType: userType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to appropriate portal
      switch (userType) {
        case "member":
          router.push("/member");
          break;
        case "provider":
          router.push("/provider");
          break;
        case "employer":
          router.push("/employer");
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="block mb-8">
            <img 
              src="/medcare-logo.png" 
              alt="MedCare Health Network" 
              className="h-14 w-auto"
            />
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Sign in to access your portal</p>

          {/* User Type Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
            {[
              { id: "member" as const, label: "Member", icon: Users },
              { id: "provider" as const, label: "Provider", icon: Building2 },
              { id: "employer" as const, label: "Employer", icon: Shield },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setUserType(type.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 px-2 rounded-lg font-medium transition-all text-sm ${
                  userType === type.id
                    ? "bg-white text-cyan-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <p><span className="font-medium">Member:</span> john.smith@email.com</p>
              <p><span className="font-medium">Provider:</span> dr.johnson@mainstreetmed.com</p>
              <p><span className="font-medium">Employer:</span> hr@acmecorp.com</p>
              <p className="text-gray-500 mt-2">Password for all: demo123</p>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-8">
            Need an account?{" "}
            <Link href="/contact" className="text-cyan-600 font-medium hover:text-cyan-700">
              Contact us
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-400 to-teal-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-white rounded-full" />
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-white rounded-full" />
        </div>
        
        <div className="relative text-white text-center max-w-md">
          <img 
            src="/medcare-logo.png" 
            alt="MedCare Health Network" 
            className="h-16 w-auto mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold mb-4">Your Health, Simplified</h2>
          <p className="text-teal-100 text-lg mb-8">
            Access your healthcare benefits, find providers, and manage your care—all in one place.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "50K+", label: "Providers" },
              { value: "500K+", label: "Members" },
              { value: "40%", label: "Savings" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-teal-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
