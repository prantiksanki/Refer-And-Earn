import React from "react";
import { Mail, Lock, User } from "lucide-react";
import Bird from "../components/Bird";

const AuthPage = ({
  type,
  formData,
  handleInputChange,
  handleSubmit,
  loading,
  message,
  goTo
})  => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center py-8">
      <div className="w-full max-w-screen-xl bg-white rounded-2xl shadow-2xl ring-1 ring-blue-100 overflow-hidden">
        <div className="md:grid md:grid-cols-2 min-h-[72vh]">
          <div className="p-10 flex flex-col items-start gap-6 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-400 rounded"></div>
              <span className="font-semibold">Refer & Earn</span>
            </div>

            <div className="mt-6">
              <div className="w-64 mx-auto md:mx-0">
                <Bird />
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-4">Join the club. Get rewards.</h3>
            <p className="text-gray-600">
              Learning is more fun with friends! Invite them to join and you'll
              both earn cool rewards.
            </p>
          </div>

          {/* Right form column */}
          <div className="p-10 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">
              {type === "signup" ? "Create your account" : "Welcome back"}
            </h2>

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
                    className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white"
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
                  className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white"
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
                  className="w-full px-4 py-3 rounded-full border border-gray-200 bg-white"
                />
              </div>


              {message && (
                <div className="p-3 rounded-md bg-green-50 text-green-700">{message}</div>
              )}

              <button
                onClick={() => handleSubmit(type)}
                disabled={loading}
                className="w-full py-3 bg-green-500 text-white rounded-full font-semibold"
              >
                {loading ? "Processing..." : type === "signup" ? "CREATE ACCOUNT" : "LOG IN"}
              </button>

              <div className="text-center text-sm text-gray-600">
                {type === "signup" ? (
                  <>
                    Already have an account?{' '}
                    <button onClick={() => goTo('login')} className="text-green-600 font-bold">Log In</button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button onClick={() => goTo('signup')} className="text-green-600 font-bold">Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;