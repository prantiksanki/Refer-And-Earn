import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import AuthPage from "../components/AuthPage";
import { setUserEmail } from "../utils/auth";


const ReferEarnApp = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("landing");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const goTo = (page) => {
    setCurrentPage(page);
    setMessage("");
    setFormData({
      name: "",
      email: "",
      password: ""
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (type) => {
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        type === "signup" ? "http://localhost:5000/api/users/register" : "http://localhost:5000/api/users/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include', // Important for cookies to be sent/received
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("Response:", response.ok, data);

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
        setLoading(false);
      } else {
        setMessage(data.message || "Success!");

        // If login successful → store user email and token will be in httpOnly cookie
        if (type === "login") {
          console.log("Login successful, user data:", data.user);
          if (data.user?.email) {
            setUserEmail(data.user.email);
            console.log("Email set, navigating to /referral");
          }
          // Redirect to referral page after login
          setTimeout(() => {
            console.log("Navigating to /referral");
            navigate("/referral");
          }, 500);
        } else {
          // If signup successful, keep on page and show message
          // User can then click login button
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      {currentPage === "landing" && <LandingPage goTo={goTo} />}

      {currentPage === "signup" && (
        <AuthPage
          type="signup"
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={loading}
          message={message}
          goTo={goTo}
        />
      )}

      {currentPage === "login" && (
        <AuthPage
          type="login"
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={loading}
          message={message}
          goTo={goTo}
        />
      )}
    </>
  );
};

export default ReferEarnApp;
