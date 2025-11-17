import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav.jsx';
import { Zap, Users, Crown, Copy, Check } from 'lucide-react';
import { authenticatedFetch, getUserEmail } from '../utils/auth';

export default function Profile() {
  const userEmail = getUserEmail() || "";
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await authenticatedFetch(`https://refer-and-earn-fzqv.onrender.com/api/users/referral-data/${userEmail}`);
        const data = await res.json();
        if (res.ok && data && data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            referralCode: data.user.referralCode,
            coins: Number(data.user.coins) || 0,
            totalReferrals: data.user.totalReferrals || 0,
            rewardTier: data.user.rewardTier || "Silver",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleCopy = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Nav />

      <main className="px-6 py-12 mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="relative mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">
            Your Profile
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your account, view referral stats and recent activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* MAIN PROFILE PANEL */}
          <div className="md:col-span-2">
            <div className="p-6 text-white border shadow-xl rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50">

              {/* Name + Email */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-white">
                  {loading ? "Loading..." : user?.name}
                </h1>
                <p className="mt-1 text-lg text-slate-300">
                  {user?.email}
                </p>
              </div>

              {/* 3 Stats */}
              <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">

                {/* Referrals */}
                <div className="bg-[#0E1525] p-6 rounded-2xl border border-white/5 shadow-lg">
                  <p className="text-lg font-semibold text-white/90">Your Referrals</p>
                  <p className="mt-3 text-3xl font-bold text-emerald-300">
                    {user?.totalReferrals || 0}
                  </p>
                  <p className="mt-1 text-sm text-emerald-400">
                    Successful referrals
                  </p>
                </div>

                {/* Coins */}
                <div className="bg-[#0E1525] p-6 rounded-2xl border border-white/5 shadow-lg">
                  <p className="text-lg font-semibold text-white/90">Coin Balance</p>
                  <p className="mt-3 text-3xl font-bold text-emerald-300">
                    {user?.coins || 0} coins
                  </p>
                  <p className="mt-1 text-sm text-cyan-400">Ready to redeem</p>
                </div>

                {/* Tier */}
                <div className="bg-[#0E1525] p-6 rounded-2xl border border-white/5 shadow-lg">
                  <p className="text-lg font-semibold text-white/90">Reward Tier</p>
                  <p className="mt-3 text-3xl font-bold text-yellow-400">
                    {user?.rewardTier}
                  </p>
                  <p className="mt-1 text-sm text-yellow-300">Elite benefits unlocked</p>
                </div>
              </div>

              {/* Referral Code */}
              <div className="bg-[#0E1525] p-8 rounded-2xl border border-white/5 shadow-lg max-w-4xl mx-auto">
                <p className="mb-2 text-xl font-semibold text-white/90">Your Referral Code</p>

                <div className="flex items-center justify-between px-6 py-4 border rounded-xl bg-[#0A0F1C] border-[#1A2236]">
                  <p className="font-mono text-3xl font-bold tracking-wide text-emerald-300">
                    {user?.referralCode}
                  </p>

                  <button
                    onClick={handleCopy}
                    className="p-3 transition rounded-xl bg-emerald-600 hover:bg-emerald-500"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">

            {/* Quick Stats */}
            <div className="p-6 border shadow-xl rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
                  <p className="text-xs text-slate-400">Overview of your referral performance</p>
                </div>
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            {/* Referrals */}
            <div className="p-6 border shadow-xl rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Referrals</h3>
                  <p className="text-xs text-slate-400">Friends who used your code</p>
                </div>
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            {/* Benefits */}
            <div className="p-6 border shadow-xl rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Benefits</h3>
                  <p className="text-xs text-slate-400">Upgrade details and perks</p>
                </div>
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li>- Earn coins for every referral</li>
                <li>- Unlock premium perks at higher tiers</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
