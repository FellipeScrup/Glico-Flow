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
    const [showSexoOptions, setShowSexoOptions] = useState(false);

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

    const handleSexoSelect = (value) => {
        setFormData(prev => ({
            ...prev,
            sexo: value
        }));
        setShowSexoOptions(false);
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
                <h1 className={styles.title}>Complete seu perfil</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className={errors.nome ? styles.inputError : ''}
                            placeholder="Digite seu nome completo *"
                        />
                        {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <div 
                            className={`${styles.customSelect} ${errors.sexo ? styles.inputError : ''}`}
                            onClick={() => setShowSexoOptions(!showSexoOptions)}
                        >
                            <span className={formData.sexo ? styles.selected : styles.placeholder}>
                                {formData.sexo || "Selecione o sexo *"}
                            </span>
                        </div>
                        
                        {showSexoOptions && (
                            <div className={styles.optionsContainer}>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleSexoSelect('Masculino')}
                                >
                                    Masculino
                                </div>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleSexoSelect('Feminino')}
                                >
                                    Feminino
                                </div>
                            </div>
                        )}
                        {errors.sexo && <span className={styles.errorMessage}>{errors.sexo}</span>}
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="idade"
                                name="idade"
                                value={formData.idade}
                                onChange={handleInputChange}
                                className={errors.idade ? styles.inputError : ''}
                                placeholder="Idade *"
                            />
                            {errors.idade && <span className={styles.errorMessage}>{errors.idade}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="peso"
                                name="peso"
                                value={formData.peso}
                                onChange={handleInputChange}
                                className={errors.peso ? styles.inputError : ''}
                                placeholder="Peso (kg) *"
                            />
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
                                placeholder="Altura (m) *"
                            />
                            {errors.altura && <span className={styles.errorMessage}>{errors.altura}</span>}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Continuar
                    </button>
                </form>
            </div>
        </div>
    );
} 