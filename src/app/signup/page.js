'use client'
import Image from "next/image";
import { useState } from "react";
import styles from "./signup.module.css";
import logo from "@/assets/glicoflow-logo.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import PrivacyTerms from "@/app/components/PrivacyTerms";
import PrivacyCheckbox from "@/app/components/PrivacyCheckbox";

export default function Signup() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        acceptedTerms: false,
        newsletter: false
    });
    const [errors, setErrors] = useState({});
    const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
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
            newErrors.email = 'Email é necessário';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }
    
        if (!formData.password) {
            newErrors.password = 'Senha é necessária';
        }
    
        if (!formData.acceptedTerms) {
            newErrors.acceptedTerms = 'Você deve aceitar os termos';
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
                        termsAccepted: formData.acceptedTerms,
                        newsletter: formData.newsletter || false
                    }),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao criar usuário');
                }
    
                const data = await response.json();
                localStorage.setItem('token', data.token); // Store the token
                localStorage.setItem('userId', data.user._id);
                console.log('Usuário criado com sucesso:', data);
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
                <h1 className={styles.title}>Crie sua conta</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? styles.inputError : ''}
                            placeholder="Digite seu email *"
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
                                placeholder="Digite sua senha *"
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

                    <PrivacyCheckbox 
                        checked={formData.acceptedTerms}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                acceptedTerms: e.target.checked
                            }));
                        }}
                    />
                    {errors.acceptedTerms && (
                        <span className={styles.errorMessage}>{errors.acceptedTerms}</span>
                    )}

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="newsletter"
                                checked={formData.newsletter}
                                onChange={handleInputChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.checkboxText}>Receber atualizações por email</span>
                        </label>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Criar Conta
                    </button>
                </form>
            </div>
        </div>
    );
}
