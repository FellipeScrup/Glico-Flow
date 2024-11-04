'use client'
import Image from "next/image";
import styles from "./signin.module.css";
import Link from "next/link";
import logo from "@/assets/glicoflow-logo.png";
import { useState } from "react";

export default function Signin() {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        lembrar: false
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

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Aqui você pode adicionar a lógica de login
            console.log('Formulário válido', formData);
        }
    };

    return(
        <form onSubmit={handleSubmit} className={styles.page}>
            <div className={styles.firstContainer}>
                <div className={styles.firstContainerImg}>
                    <Image src={logo} alt="GlicoFlow Logo" />
                </div>
                <div className={styles.firstContainerText}>
                    <h1>Bem vindo de volta!</h1>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            placeholder="Seu email:" 
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? styles.inputError : ''}
                        />
                        <label htmlFor="email">Seu email:</label>
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type="password" 
                            id="senha" 
                            name="senha"
                            placeholder="Sua senha:" 
                            value={formData.senha}
                            onChange={handleInputChange}
                            className={errors.senha ? styles.inputError : ''}
                        />
                        <label htmlFor="senha">Sua senha:</label>
                        {errors.senha && <span className={styles.errorMessage}>{errors.senha}</span>}
                    </div>
                </div>
                <div className={styles.box}>
                    <div className={styles.checkboxGroup}>
                        <input 
                            type="checkbox" 
                            id="lembrar" 
                            name="lembrar"
                            checked={formData.lembrar}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="lembrar">Lembrar acesso</label>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.criarContaButton}>Entrar</button>
                </div>
            </div>
        </form>
    );
}
