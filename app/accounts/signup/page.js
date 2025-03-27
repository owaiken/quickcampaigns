"use client";

import { useState } from "react";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import "/app/accounts/login/Login.css"; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    recaptcha: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        error = value.trim() === "" ? "Name is required" : "";
        break;
      case "email":
        error = /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email";
        break;
      case "password":
        error = value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        error = value === formData.password ? "" : "Passwords do not match";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value); // Validate on change as well
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check all fields before submission
    Object.keys(formData).forEach((key) => {
      if (key !== "recaptcha") {
        validateField(key, formData[key]);
      }
    });

    // Check if there are any errors
    if (Object.values(errors).every((error) => error === "")) {
      console.log("Form Data Submitted:", formData);
    } else {
      console.log("Form has errors:", errors);
    }
  };

  return (
    <div className="page-container">
      <Link href="/">
        <img src="/assets/logo-header.png" alt="Logo" className="logo-header" />
      </Link>

      <div className="container">
        <h1>Complete Your Registration</h1>
        <p>Set your username and password to proceed.</p>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Name Input */}
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-input"
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          {/* Password Input */}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              <img
                src={showPassword ? "/assets/eye-off.svg" : "/assets/eye.svg"}
                alt="Toggle Password Visibility"
              />
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          {/* Confirm Password Input */}
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword" // Fixed from "password" to "confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword} // Fixed to use confirmPassword
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-input"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              <img
                src={showPassword ? "/assets/eye-off.svg" : "/assets/eye.svg"}
                alt="Toggle Password Visibility"
              />
            </span>
          </div>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          {/* ReCAPTCHA (optional - uncomment if you want to use it) */}
          {/* <ReCAPTCHA
            sitekey="YOUR_RECAPTCHA_SITE_KEY"
            onChange={(value) => setFormData((prev) => ({ ...prev, recaptcha: value }))}
          /> */}

          {/* Submit Button */}
          <button type="submit" className="option-button">
            Finish
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;