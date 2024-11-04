'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./personal-data.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function PersonalData() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: '',
        idade: '',
        peso: '',
        altura: '',
        sexo: ''
    });
    const [errors, setErrors] = useState({});

    const validateFullName = (name) => {
        const names = name.trim().split(' ');
        return names.length >= 2 && names[0].length > 0 && names[1].length > 0;
    };

    const formatHeight = (value) => {
        // Remove tudo que não é número
        value = value.replace(/[^\d]/g, '');
        
        // Limita a 3 dígitos
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        
        // Adiciona o ponto após o primeiro número
        if (value.length >= 1) {
            value = value.slice(0, 1) + '.' + value.slice(1);
        }

        return value;
    };

    const formatWeight = (value) => {
        // Remove tudo que não é número ou ponto
        value = value.replace(/[^\d.]/g, '');
        
        // Limita a 5 caracteres (incluindo ponto)
        if (value.length > 5) {
            value = value.slice(0, 5);
        }

        // Garante que só tenha um ponto
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        return value;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        switch (name) {
            case 'altura':
                processedValue = formatHeight(value);
                break;
            case 'peso':
                processedValue = formatWeight(value);
                break;
            case 'idade':
                processedValue = value.replace(/\D/g, '').slice(0, 3);
                break;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (!validateFullName(formData.nome)) {
            newErrors.nome = 'Digite nome e sobrenome';
        }

        if (!formData.idade) {
            newErrors.idade = 'Idade é obrigatória';
        } else if (formData.idade < 1 || formData.idade > 120) {
            newErrors.idade = 'Idade inválida';
        }

        if (!formData.peso) {
            newErrors.peso = 'Peso é obrigatório';
        } else if (formData.peso < 20 || formData.peso > 300) {
            newErrors.peso = 'Peso inválido';
        }

        if (!formData.altura) {
            newErrors.altura = 'Altura é obrigatória';
        } else if (formData.altura < 0.5 || formData.altura > 2.5) {
            newErrors.altura = 'Altura inválida';
        }

        if (!formData.sexo) {
            newErrors.sexo = 'Selecione o sexo';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            router.push('/diabetes-type');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.firstContainer}>
                <div className={styles.firstContainerImg}>
                    <Image src={logo} alt="GlicoFlow Logo" width={200} height={180} />
                </div>
                <div className={styles.firstContainerText}>
                    <h1>Complete seu perfil</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.container}>
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className={errors.nome ? styles.inputError : ''}
                        />
                        <label htmlFor="nome">Nome completo</label>
                        {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <select
                            id="sexo"
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleInputChange}
                            className={`${styles.select} ${errors.sexo ? styles.inputError : ''}`}
                        >
                            <option value="">Selecione o sexo</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                        </select>
                        <label htmlFor="sexo">Sexo</label>
                        {errors.sexo && <span className={styles.errorMessage}>{errors.sexo}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <input 
                            type="text"
                            id="idade"
                            name="idade"
                            value={formData.idade}
                            onChange={handleInputChange}
                            className={errors.idade ? styles.inputError : ''}
                        />
                        <label htmlFor="idade">Idade</label>
                        {errors.idade && <span className={styles.errorMessage}>{errors.idade}</span>}
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="peso"
                                name="peso"
                                value={formData.peso}
                                onChange={handleInputChange}
                                className={errors.peso ? styles.inputError : ''}
                            />
                            <label htmlFor="peso">Peso (kg)</label>
                            {errors.peso && <span className={styles.errorMessage}>{errors.peso}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="altura"
                                name="altura"
                                value={formData.altura}
                                onChange={handleInputChange}
                                className={errors.altura ? styles.inputError : ''}
                            />
                            <label htmlFor="altura">Altura (m)</label>
                            {errors.altura && <span className={styles.errorMessage}>{errors.altura}</span>}
                        </div>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.continueButton}>
                        Continuar
                    </button>
                </div>
            </form>
        </div>
    );
} 