'use client'
import Image from "next/image";
import styles from "./signup.module.css";
import Link from "next/link";
import logo from "@/assets/glicoflow-logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
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

    return(
        <form onSubmit={handleSubmit} className={styles.page}>
            <div className={styles.firstContainer}>
                <div className={styles.firstContainerImg}>
                    <Image src={logo} alt="GlicoFlow Logo" />
                </div>
                <div className={styles.firstContainerText}>
                    <h1>Por favor, insira seu email e senha para criar uma conta</h1>
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
                            id="termos" 
                            name="termos"
                            checked={formData.termos}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="termos">Eu li e aceito os <span>termos de privacidade</span></label>
                        {errors.termos && <span className={styles.errorMessage}>{errors.termos}</span>}
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input 
                            type="checkbox" 
                            id="newsletter" 
                            name="newsletter"
                            checked={formData.newsletter}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="newsletter">Opcional: Desejo receber novidades e promoções por email</label>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.criarContaButton}>Criar conta</button>
                </div>
            </div>
        </form>
    );
}

