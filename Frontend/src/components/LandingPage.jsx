import React from "react";
import { Gift, Sparkles, Users, Zap } from "lucide-react";
import Bird from "../components/Bird";

const LandingPage = ({ goTo }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-screen-xl p-8 mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-white bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl w-10 h-10 shadow-lg shadow-emerald-500/30">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Refer & Earn</span>
          </div>

          <button 
            onClick={() => goTo("login")} 
            className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </header>

        <div className="relative overflow-hidden border border-slate-700/50 shadow-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-3xl">
          <div className="md:grid md:grid-cols-2 gap-12 p-12 items-center min-h-[72vh]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
                    Learn Together,
                  </span>
                  <br />
                  <span className="text-white">Earn Together!</span>
                </h1>

                <p className="max-w-lg text-lg text-slate-300 leading-relaxed">
                  Invite friends, collaborate and both earn rewards while you learn.
                  Share your referral link and watch your rewards grow in real-time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button 
                  onClick={() => goTo("signup")} 
                  className="px-8 py-4 font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Earning
                </button>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 border rounded-xl bg-slate-800/50 border-slate-700/50">
                  <Users className="w-6 h-6 mb-2 text-emerald-400" />
                  <p className="text-sm font-semibold text-white">Unlimited Referrals</p>
                  <p className="text-xs text-slate-400">No limits on invites</p>
                </div>
                <div className="p-4 border rounded-xl bg-slate-800/50 border-slate-700/50">
                  <Zap className="w-6 h-6 mb-2 text-cyan-400" />
                  <p className="text-sm font-semibold text-white">Instant Rewards</p>
                  <p className="text-xs text-slate-400">Real-time updates</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-6">
              <div className="relative w-80">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
                <div className="relative">
                  <Bird />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
