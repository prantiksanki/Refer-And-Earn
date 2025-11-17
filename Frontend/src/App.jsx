import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LandingPage from "./components/LandingPage";
import ReferEarnApp from "./pages/ReferEarnApp";
// import AuthPage from "./components/AuthPage";
import ReferralPage from "./pages/ReferralPage";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<ReferEarnApp/>} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
