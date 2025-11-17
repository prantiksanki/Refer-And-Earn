import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import LandingPage from "./components/LandingPage";
import ReferEarnApp from "./pages/ReferEarnApp";
// import AuthPage from "./components/AuthPage";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<ReferEarnApp/>} />

      </Routes>
    </Router>
  );
}

export default App;
