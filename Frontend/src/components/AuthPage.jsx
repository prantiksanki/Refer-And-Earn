import React from "react";
import { Mail, Lock, User } from "lucide-react";
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
    <div className="flex items-center justify-center min-h-screen py-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="w-full max-w-screen-xl overflow-hidden bg-white shadow-2xl rounded-2xl ring-1 ring-blue-100">
        <div className="md:grid md:grid-cols-2 min-h-[72vh]">
          
          {/* LEFT SECTION */}
          <div className="flex flex-col items-start gap-6 p-10 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded"></div>
              <span className="font-semibold">Refer & Earn</span>
            </div>

            <div className="mt-6">
              <div className="w-64 mx-auto md:mx-0">
                <Bird />
              </div>
            </div>

            <h3 className="mt-4 text-2xl font-bold">Join the club. Get rewards.</h3>
            <p className="text-gray-600">
              Learning is more fun with friends! Invite them to join and you'll
              both earn cool rewards.
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="p-10 bg-gray-50">

            {/* 🔥 LOGIN / SIGNUP BUTTON TOGGLE */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => goTo("login")}
                className={`px-6 py-2 rounded-l-full border border-gray-300 
                  ${type === "login" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600"}`}
              >
                Login
              </button>

              <button
                onClick={() => goTo("signup")}
                className={`px-6 py-2 rounded-r-full border border-gray-300 
                  ${type === "signup" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600"}`}
              >
                Sign Up
              </button>
            </div>

            <h2 className="mb-6 text-2xl font-bold">
              {type === "signup" ? "Create your account" : "Welcome back"}
            </h2>

            {/* FORM FIELDS */}
            <div className="space-y-4">
              {type === "signup" && (
                <div>
                  <label className="sr-only">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-full"
                  />
                </div>
              )}

              <div>
                <label className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-full"
                />
              </div>

              <div>
                <label className="sr-only">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-full"
                />
              </div>

              {/* STATUS MESSAGE */}
              {message && (
                <div className="p-3 text-green-700 rounded-md bg-green-50">
                  {message}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                onClick={() => handleSubmit(type)}
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-green-500 rounded-full"
              >
                {loading ? "Processing..." : type === "signup" ? "CREATE ACCOUNT" : "LOG IN"}
              </button>

             
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
