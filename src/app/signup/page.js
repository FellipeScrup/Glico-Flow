'use client'
import Image from "next/image";
import { useState } from "react";
import styles from "./signup.module.css";
import logo from "@/assets/glicoflow-logo.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        terms: false,
        newsletter: false
    });
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
    
        // Basic validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email';
        }
    
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
    
        if (!formData.terms) {
            newErrors.terms = 'You must accept the terms';
        }
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        termsAccepted: formData.terms,
                        newsletter: formData.newsletter || false
                    }),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to sign up');
                }
    
                const data = await response.json();
                localStorage.setItem('token', data.token); // Store the token
                localStorage.setItem('userId', data.user._id);
                console.log('User created successfully:', data);
                // Redirect to the personal data page
                router.push('/personal-data');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    
    
    return (
        <div className={styles.page}>
            <div className={styles.logoContainer}>
                <Image
                    src={logo}
                    alt="GlicoFlow Logo"
                    width={320}
                    height={320}
                    priority
                    className={styles.logo}
                />
            </div>

            <div className={styles.formContainer}>
                <h1 className={styles.title}>Create Account</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? styles.inputError : ''}
                            placeholder="Enter your email *"
                            required
                        />
                        {errors.email && (
                            <span className={styles.errorMessage}>{errors.email}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordWrapper}>
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={errors.password ? styles.inputError : ''}
                                placeholder="Enter your password *"
                                required
                            />
                            <button 
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className={styles.errorMessage}>{errors.password}</span>
                        )}
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleInputChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.checkboxText}>
                                I accept the <a href="#" className={styles.termsLink}>terms of privacy</a>
                            </span>
                        </label>
                        {errors.terms && (
                            <span className={styles.errorMessage}>{errors.terms}</span>
                        )}
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="newsletter"
                                checked={formData.newsletter}
                                onChange={handleInputChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.checkboxText}>Receive news updates by email</span>
                        </label>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}

