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
        senha: '',
        termos: false,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.senha) {
            newErrors.senha = 'Senha é obrigatória';
        }

        if (!formData.termos) {
            newErrors.termos = 'Você precisa aceitar os termos';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Aqui você pode adicionar a lógica de cadastro
            console.log('Formulário válido', formData);
            // Redireciona para a página de dados pessoais
            router.push('/personal-data');
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
                <h1 className={styles.title}>Criar Conta</h1>
                
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
                                id="senha" 
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                                className={errors.senha ? styles.inputError : ''}
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
                        {errors.senha && (
                            <span className={styles.errorMessage}>{errors.senha}</span>
                        )}
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="termos"
                                checked={formData.termos}
                                onChange={handleInputChange}
                            />
                            <span className={styles.checkmark}></span>
                            <span className={styles.checkboxText}>
                                Aceito os <a href="#" className={styles.termsLink}>termos de privacidade</a>
                            </span>
                        </label>
                        {errors.termos && (
                            <span className={styles.errorMessage}>{errors.termos}</span>
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
                            <span className={styles.checkboxText}>Receber novidades por email</span>
                        </label>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Criar conta
                    </button>
                </form>
            </div>
        </div>
    );
}

