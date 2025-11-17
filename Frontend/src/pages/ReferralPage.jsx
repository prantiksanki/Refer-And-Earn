import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Users, Zap, Crown, Copy, Check, LogOut } from 'lucide-react';
import io from 'socket.io-client';
import Nav from '../components/Nav.jsx';

function ReferralPage() {
  const navigate = useNavigate();
  const [referrerList, setReferrerList] = useState([]);
  const [referredUsersList, setReferredUsersList] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [totalNo, setTotalNo] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [rewardTier, setRewardTier] = useState('Silver');
  const [userName, setUserName] = useState('');
  const [userId] = useState(localStorage.getItem('userEmail') || 'user@example.com');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/referral-data/${userId}`);
        const data = await response.json();
        console.log('Referral Data:', data);

        if (response.ok) {
          setUserName(data.user.name);
          setReferralCode(data.user.referralCode);
          setTotalNo(data.user.totalReferrals || 0);
          setCoinBalance(Number(data.user.coins) || 0);
          setRewardTier(data.user.rewardTier || 'Silver');
          setReferredUsersList(data.referrers || []);
          setReferrerList(data.referredUsers || []);
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [userId]);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Join user room
    socketRef.current.emit('join-user', userId);

    // Listen for real-time updates
    socketRef.current.on('connect', () => {
      console.log('✓ Connected to real-time server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('✗ Disconnected from real-time server');
    });

    // Listen for referral applied event (when user applies someone else's code)
    socketRef.current.on('referral-applied', (data) => {
      console.log('Referral Applied:', data);
      if (data.totalCoins !== undefined && data.totalCoins !== null) {
        setCoinBalance(data.totalCoins);
        // Update reward tier based on coins
        const tier = data.totalCoins >= 500 ? 'Premium' : data.totalCoins >= 200 ? 'Gold' : 'Silver';
        setRewardTier(tier);
      }
      
      // Note: User's referrer will be refreshed when they apply the code
      // This is already handled in handleApplyCode function
    });

    // Listen for new referral event (when someone uses YOUR code)
    socketRef.current.on('new-referral', (data) => {
      console.log('New Referral Received:', data);
      // Update total referrals count
      if (data.totalReferrals !== undefined && data.totalReferrals !== null) {
        setTotalNo(data.totalReferrals);
      }
      // Refetch the complete data to ensure coin balance is correct
      const fetchUpdatedData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/users/referral-data/${userId}`);
          const referralData = await response.json();
          if (response.ok) {
            setCoinBalance(referralData.user.coins || 0);
            const tier = referralData.user.coins >= 500 ? 'Premium' : referralData.user.coins >= 200 ? 'Gold' : 'Silver';
            setRewardTier(tier);
          }
        } catch (error) {
          console.error('Error refetching referral data:', error);
        }
      };
      fetchUpdatedData();
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, coinBalance]);

  const handleApplyCode = async (e) => {
    e.preventDefault();
    const inputCode = e.target.elements[0].value;
    
    if (!inputCode.trim()) {
      alert('Please enter a referral code');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/referral/apply-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          referralCode: inputCode,
          email: userId
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Success! You've joined using the referral code. You earned ${data.coinsAwarded} coins!`);
        
        // Directly set referrer from response if available
        if (data.referrer) {
          console.log('Setting your referrer from API response:', data.referrer);
          setReferredUsersList([data.referrer]);
        }
        
        // Also refetch complete data to ensure everything is in sync
        try {
          const referralResponse = await fetch(`http://localhost:5000/api/users/referral-data/${userId}`);
          const referralData = await referralResponse.json();
          console.log('Updated Referral Data:', referralData);
          
          if (referralResponse.ok) {
            setReferralCode(referralData.user.referralCode);
            setTotalNo(referralData.user.totalReferrals || 0);
            setCoinBalance(Number(referralData.user.coins) || 0);
            setRewardTier(referralData.user.rewardTier || 'Silver');
            setReferredUsersList(referralData.referrer ? [referralData.referrer] : []);
            setReferrerList(referralData.referredUsers || []);
          }
        } catch (error) {
          console.error('Error refetching referral data:', error);
        }
        
        e.target.reset();
      } else {
        alert(data.message || 'Error applying referral code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error applying referral code');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };


  return (
    
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <style>{`\n        /* Scoped custom scrollbar for referral lists */\n        .custom-scroll::-webkit-scrollbar { width: 10px; }\n        .custom-scroll::-webkit-scrollbar-track { background: rgba(15,23,42,0.08); border-radius: 8px; }\n        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.3); border-radius: 8px; }\n        /* Firefox */\n        .custom-scroll { scrollbar-color: rgba(15,23,42,0.3) rgba(15,23,42,0.08); scrollbar-width: thin; }\n      `}</style>
      <Nav/>

      <main className="px-6 py-12 mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-cyan-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative p-8 border shadow-2xl md:p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm rounded-3xl">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="flex-shrink-0">
                <div className="p-4 shadow-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-emerald-500/30">
                  <Gift className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="mb-3 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text">
                  Share & Earn Together
                </h1>
                <p className="text-lg text-slate-300">
                  Invite friends and both earn exclusive rewards. No limits, pure earning potential!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <div className="relative p-6 overflow-hidden border shadow-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm rounded-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full bg-emerald-500/10"></div>
            <div className="relative">
              <p className="mb-2 text-sm font-medium text-slate-400">Your Referrals</p>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-emerald-400">{totalNo}</div>
                <span className="text-slate-400">friends</span>
              </div>
              <div className="mt-3 text-xs text-emerald-300">+{totalNo * 50} coins earned</div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden border shadow-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm rounded-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full bg-cyan-500/10"></div>
            <div className="relative">
              <p className="mb-2 text-sm font-medium text-slate-400">Coin Balance</p>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-cyan-400">{coinBalance}</div>
                <span className="text-slate-400">coins</span>
              </div>
              <div className="mt-3 text-xs text-cyan-300">Ready to redeem</div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden border shadow-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm rounded-2xl">
            <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full bg-purple-500/10"></div>
            <div className="relative">
              <p className="mb-2 text-sm font-medium text-slate-400">Reward Tier</p>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div className="text-3xl font-bold text-yellow-400">{rewardTier}</div>
              </div>
              <div className="mt-3 text-xs text-yellow-300">Elite benefits unlocked</div>
            </div>
          </div>
        </div>

        {/* Referral Code Box */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-emerald-600/10 rounded-2xl blur-2xl"></div>
          <div className="relative p-8 border shadow-xl bg-gradient-to-r from-slate-800/70 to-slate-900/70 border-slate-700/50 backdrop-blur-sm rounded-2xl">
            <p className="mb-4 text-sm font-medium text-slate-300">Your Referral Code</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-4 border bg-slate-950/50 border-slate-700/50 rounded-xl">
                <p className="font-mono text-3xl font-bold tracking-wider text-emerald-400">{referralCode}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-4 text-white transition transform shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-emerald-500/30 hover:scale-105"
              >
                {copiedCode ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">Share this code with friends and earn 50 coins per referral</p>
          </div>
        </div>

        {/* Apply Code Section */}
        <div className="p-8 mb-12 border shadow-xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm rounded-2xl">
          <p className="mb-4 text-sm font-medium text-slate-300">Have a referral code?</p>
          <form onSubmit={handleApplyCode} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter friend's referral code here..."
              className="flex-1 px-6 py-4 text-white transition border bg-slate-950/50 border-slate-700/50 placeholder-slate-500 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button type="submit" className="px-8 py-4 font-bold text-white transition transform shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-emerald-500/30 hover:scale-105">
              APPLY CODE
            </button>
          </form>
        </div>

        {/* Referral Sections - Side by Side */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Your Referrer */}
          <div className="relative p-8 border shadow-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm rounded-2xl">
            <div className="absolute w-12 h-12 rounded-full top-6 right-6 bg-emerald-500/10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 border bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 rounded-xl">
                <Gift className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Who Referred You</h2>
                <p className="text-sm text-slate-400">Your inviter</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-slate-400">
              The person who invited you to join. You both earn when you use their code!
            </p>
            
            <div className="pr-2 space-y-4 overflow-y-auto max-h-96 custom-scroll">
              {referredUsersList.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50">
                    <Crown className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400">You haven't used a referral code yet</p>
                </div>
              ) : (
                referredUsersList.map((person, index) => (
                  <div
                    key={index}
                    className="p-4 transition border bg-slate-950/40 border-slate-700/30 rounded-xl hover:border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500"></div>
                        <div>
                          <p className="font-semibold text-white">{person.name}</p>
                          <p className="text-xs text-slate-400">{person.joinedDate}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 border rounded-full bg-emerald-500/20 border-emerald-500/50">
                        <p className="text-xs font-bold text-emerald-300">Active</p>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg bg-slate-900/50 border-slate-700/50">
                      <p className="mb-1 text-xs text-slate-400">Their Code</p>
                      <p className="font-mono font-bold tracking-wider text-emerald-400">{person.code}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Friends You Referred */}
          <div className="relative p-8 border shadow-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 backdrop-blur-sm rounded-2xl">
            <div className="absolute w-12 h-12 rounded-full top-6 right-6 bg-cyan-500/10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 border bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/30 rounded-xl">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Friends You Referred</h2>
                <p className="text-sm text-slate-400">Your referrals</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-slate-400">
              Friends who joined using your code. You both earn rewards!
            </p>

            <div className="pr-2 space-y-4 overflow-y-auto max-h-96 custom-scroll">
              {referrerList.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50">
                    <Users className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400">No friends referred yet. Share your code!</p>
                </div>
              ) : (
                referrerList.map((user, index) => (
                  <div
                    key={index}
                    className="p-4 transition border bg-slate-950/40 border-slate-700/30 rounded-xl hover:border-cyan-500/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-400">Joined recently</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyan-400">+{user.coins}</p>
                        <p className="text-xs text-slate-400">coins</p>
                      </div>
                    </div>
                    <div className="p-3 mb-2 border rounded-lg bg-slate-900/50 border-slate-700/50">
                      <p className="mb-1 text-xs text-slate-400">Their Code</p>
                      <p className="font-mono font-bold tracking-wider text-cyan-400">{user.code}</p>
                    </div>
                    <p className="text-xs text-slate-400">Joined: {user.joinedDate}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-3">
          <div className="p-6 border bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-500/20 rounded-2xl">
            <Zap className="w-8 h-8 mb-3 text-emerald-400" />
            <h3 className="mb-2 font-bold text-white">Instant Rewards</h3>
            <p className="text-sm text-slate-300">Get coins immediately when your friend joins</p>
          </div>
          <div className="p-6 border bg-gradient-to-br from-cyan-900/20 to-cyan-950/20 border-cyan-500/20 rounded-2xl">
            <Users className="w-8 h-8 mb-3 text-cyan-400" />
            <h3 className="mb-2 font-bold text-white">Unlimited Referrals</h3>
            <p className="text-sm text-slate-300">No cap on how many friends you can refer</p>
          </div>
          <div className="p-6 border bg-gradient-to-br from-purple-900/20 to-purple-950/20 border-purple-500/20 rounded-2xl">
            <Crown className="w-8 h-8 mb-3 text-purple-400" />
            <h3 className="mb-2 font-bold text-white">Exclusive Perks</h3>
            <p className="text-sm text-slate-300">Unlock premium features with referral rewards</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReferralPage;
