import React, { useState } from "react";
import LandingPage from "../components/LandingPage";
import AuthPage from "../components/AuthPage";

const ReferEarnApp = () => {
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
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
      } else {
        setMessage(data.message || "Success!");

        // If login successful → store token
        if (type === "login" && data.token) {
          localStorage.setItem("token", data.token);
        }

        // OPTIONAL: redirect after success
        // setCurrentPage("landing");
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
    }

    setLoading(false);
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
