import React from "react";
import { Gift, ChevronRight } from "lucide-react";
import Bird from "../components/Bird";

const LandingPage = ({ goTo }) => {
  return (
    <div className="flex items-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="w-full max-w-screen-xl p-8 mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-white bg-green-500 rounded w-9 h-9">
              <Gift />
            </div>
            <span className="text-xl font-semibold text-green-700">Refer & Earn</span>
          </div>

          <button onClick={() => goTo("login")} className="px-4 py-2 text-white bg-green-600 rounded-full">
            Get Started
          </button>
        </header>

        <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
          <div className="md:grid md:grid-cols-2 gap-8 p-12 items-center min-h-[72vh]">
            <div className="space-y-6">
              <h1 className="text-5xl font-extrabold leading-tight">
                Learn Together,
                <br />
                <span className="text-gray-800">Earn Together!</span>
              </h1>

              <p className="max-w-lg text-gray-600">
                Invite friends, collaborate and both earn rewards while you learn.
                Share your referral link and watch your rewards grow.
              </p>

              <div className="flex items-center gap-4">
                <button onClick={() => goTo("signup")} className="px-6 py-3 font-semibold text-white bg-green-600 rounded-full">
                  Start Earning
                </button>
{/* 
                <button className="flex items-center gap-2 font-medium text-green-600">
                  Learn More <ChevronRight />
                </button> */}
              </div>
            </div>

            <div className="flex items-center justify-center p-6">
              <div className="w-80">
                <Bird />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
