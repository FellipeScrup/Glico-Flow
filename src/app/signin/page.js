'use client'
import Image from "next/image";
import { useState } from "react";
import styles from "./signin.module.css";
import logo from "@/assets/glicoflow-logo.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        lembrar: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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
        } else if (formData.senha.length < 6) {
            newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Aqui vai a lógica de submissão do formulário
        console.log('Form submitted:', formData);
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
                <h1 className={styles.title}>Entrar</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? styles.inputError : ''}
                            placeholder="Email"
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
                                placeholder="Senha"
                            />
                            <button 
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                                name="lembrar"
                                checked={formData.lembrar}
                                onChange={handleInputChange}
                            />
                            <span className={styles.checkmark}></span>
                            Lembrar de mim
                        </label>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
