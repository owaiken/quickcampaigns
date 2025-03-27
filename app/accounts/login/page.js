"use client";

import { useState } from "react";
import Link from "next/link";
import "./Login.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
        recaptcha: null,
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    // Field validation function
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "email":
                if (!value) {
                    error = "Required";
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    error = "Invalid email";
                }
                break;
            case "password":
                if (!value) {
                    error = "Required";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters";
                }
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Validate onBlur
    const handleBlur = (e) => {
        validateField(e.target.name, e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        validateField("email", formData.email);
        validateField("password", formData.password);

        if (!errors.email && !errors.password && (!formData.recaptcha || formData.recaptcha)) {
            console.log("Form Data Submitted:", formData);
            window.location.href = "/main"; // Redirects and reloads the page
        }
    };

    return (
        <div className="page-container">
            <Link href="/"><img src="/assets/logo-header.png" alt="Logo" className="logo-header" /></Link>

            {/* Login Container */}
            <div className="container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit} className="form-container">
                    {/* Email Input */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
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

                    {/* Remember Me Checkbox */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <span className="remember-me-text">Remember me</span>
                    </div>
                    <button type="submit" className="option-button">
                        Sign In
                    </button>
                </form>
                <p className="switchLink">
                    <Link href="/accounts/password_reset" className="linkText">
                        Forgot your password?
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;