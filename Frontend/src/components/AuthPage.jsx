import React from "react";
import { Mail, Lock, User, Gift, Sparkles } from "lucide-react";
import Bird from "../components/Bird";
import { useEffect } from "react";

const AuthPage = ({
  type,
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  message,
  goTo
}) => {

   useEffect(() => {
    if (type === "signup" && message === "User registered successfully") {
      const timer = setTimeout(() => {
        goTo("login");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message, type, goTo]);
  
  return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-screen-xl overflow-hidden border shadow-2xl border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl">
        <div className="md:grid md:grid-cols-2 min-h-[72vh]">
          
          {/* LEFT SECTION */}
          <div className="flex flex-col items-start gap-6 p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-white shadow-lg bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl shadow-emerald-500/30">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Refer & Earn</span>
            </div>

            <div className="mt-6">
              <div className="relative w-64 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl"></div>
                <div className="relative">
                  <Bird />
                </div>
              </div>
            </div>

            <h3 className="mt-4 text-3xl font-bold text-white">Join the club. Get rewards.</h3>
            <p className="leading-relaxed text-slate-300">
              Learning is more fun with friends! Invite them to join and you'll
              both earn cool rewards in real-time.
            </p>

            <div className="flex items-center gap-2 mt-4 text-sm text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Instant coin updates</span>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="p-10 bg-slate-900/30">

            {/* LOGIN / SIGNUP BUTTON TOGGLE */}
            <div className="flex items-center p-1 mb-8 border rounded-full bg-slate-800/50 border-slate-700/50">
              <button
                onClick={() => goTo("login")}
                className={`flex-1 px-6 py-2.5 rounded-full font-semibold transition-all
                  ${type === "login" 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" 
                    : "text-slate-400 hover:text-white"}`}
              >
                Login
              </button>

              <button
                onClick={() => goTo("signup")}
                className={`flex-1 px-6 py-2.5 rounded-full font-semibold transition-all
                  ${type === "signup" 
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30" 
                    : "text-slate-400 hover:text-white"}`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="mb-6 text-3xl font-bold text-white">
              {type === "signup" ? "Create your account" : "Welcome back"}
            </h2>

            {/* FORM FIELDS */}
            <div className="space-y-4">
              {type === "signup" && (
                <div className="relative">
                  <label className="sr-only">Full Name</label>
                  <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-12 pr-4 text-white transition-all border bg-slate-800/50 border-slate-700/50 placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              )}

              <div className="relative">
                <label className="sr-only">Email</label>
                <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-12 pr-4 text-white transition-all border bg-slate-800/50 border-slate-700/50 placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="relative">
                <label className="sr-only">Password</label>
                <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full py-3 pl-12 pr-4 text-white transition-all border bg-slate-800/50 border-slate-700/50 placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* STATUS MESSAGE */}
              {message && (
                <div className={`p-4 rounded-xl border ${
                  message.includes("successfully") || message.includes("success")
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {message}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                onClick={() => handleSubmit(type)}
                disabled={loading}
                className="w-full py-3.5 font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {type === "signup" ? "CREATE ACCOUNT" : "LOG IN"}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
