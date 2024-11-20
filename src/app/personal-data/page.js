'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./personal-data.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function PersonalData() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
        gender: ''
    });
    const [errors, setErrors] = useState({});
    const [showGenderOptions, setShowGenderOptions] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            }
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação dos campos
        const validationErrors = {};
        if (!formData.name) validationErrors.name = 'Nome é obrigatório';
        if (!formData.gender) validationErrors.gender = 'Gênero é obrigatório';
        if (!formData.age) validationErrors.age = 'Idade é obrigatória';
        if (!formData.weight) validationErrors.weight = 'Peso é obrigatório';
        if (!formData.height) validationErrors.height = 'Altura é obrigatória';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Usuário não autenticado');
            }

            const response = await fetch('http://localhost:5000/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao atualizar dados do usuário');
            }

            // Opcional: você pode salvar os dados atualizados no localStorage
            localStorage.setItem('userData', JSON.stringify(data.user));

            // Redireciona para a próxima página
            router.push('/diabetes-type');
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
            setErrors({ form: error.message });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleGenderSelect = (gender) => {
        setFormData(prev => ({
            ...prev,
            gender
        }));
        setShowGenderOptions(false);
        if (errors.gender) {
            setErrors(prev => ({
                ...prev,
                gender: ''
            }));
        }
    };

    if (!isClient) {
        return null;
    }

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
            {errors.form && <span className={styles.errorMessage}>{errors.form}</span>}
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Complete seu perfil</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? styles.inputError : ''}
                            placeholder="Digite seu nome completo *"
                        />
                        {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <div 
                            className={`${styles.customSelect} ${errors.gender ? styles.inputError : ''}`}
                            onClick={() => setShowGenderOptions(!showGenderOptions)}
                        >
                            <span className={formData.gender ? styles.selected : styles.placeholder}>
                                {formData.gender || "Selecione o gênero *"}
                            </span>
                        </div>
                        
                        {showGenderOptions && (
                            <div className={styles.optionsContainer}>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleGenderSelect('Male')}
                                >
                                    Masculino
                                </div>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleGenderSelect('Female')}
                                >
                                    Feminino
                                </div>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleGenderSelect('Other')}
                                >
                                    Outro
                                </div>
                            </div>
                        )}
                        {errors.gender && <span className={styles.errorMessage}>{errors.gender}</span>}
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <input 
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={errors.age ? styles.inputError : ''}
                                placeholder="Idade *"
                            />
                            {errors.age && <span className={styles.errorMessage}>{errors.age}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className={errors.weight ? styles.inputError : ''}
                                placeholder="Peso (kg) *"
                            />
                            {errors.weight && <span className={styles.errorMessage}>{errors.weight}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                className={errors.height ? styles.inputError : ''}
                                placeholder="Altura (cm) *"
                            />
                            {errors.height && <span className={styles.errorMessage}>{errors.height}</span>}
                        </div>
                    </div>

                    {errors.form && <span className={styles.errorMessage}>{errors.form}</span>}

                    <button type="submit" className={styles.submitButton}>
                        Continuar
                    </button>
                </form>
            </div>
        </div>
    );
}
