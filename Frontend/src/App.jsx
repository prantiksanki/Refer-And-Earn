import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LandingPage from "./components/LandingPage";
import ReferEarnApp from "./pages/ReferEarnApp";
// import AuthPage from "./components/AuthPage";
import ReferralPage from "./pages/ReferralPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<ReferEarnApp/>} />
        <Route path="/referral" element={
          <ProtectedRoute>
            <ReferralPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
