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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (typeof window !== 'undefined') {
            localStorage.setItem('userData', JSON.stringify(formData));
        }
        // ... resto da lógica
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

            <div className={styles.formContainer}>
                <h1 className={styles.title}>Complete your profile</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={errors.name ? styles.inputError : ''}
                            placeholder="Enter your full name *"
                        />
                        {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <div 
                            className={`${styles.customSelect} ${errors.gender ? styles.inputError : ''}`}
                            onClick={() => setShowGenderOptions(!showGenderOptions)}
                        >
                            <span className={formData.gender ? styles.selected : styles.placeholder}>
                                {formData.gender || "Select gender *"}
                            </span>
                        </div>
                        
                        {showGenderOptions && (
                            <div className={styles.optionsContainer}>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleGenderSelect('Male')}
                                >
                                    Male
                                </div>
                                <div 
                                    className={styles.option}
                                    onClick={() => handleGenderSelect('Female')}
                                >
                                    Female
                                </div>
                            </div>
                        )}
                        {errors.gender && <span className={styles.errorMessage}>{errors.gender}</span>}
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={errors.age ? styles.inputError : ''}
                                placeholder="Age *"
                            />
                            {errors.age && <span className={styles.errorMessage}>{errors.age}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className={errors.weight ? styles.inputError : ''}
                                placeholder="Weight (kg) *"
                            />
                            {errors.weight && <span className={styles.errorMessage}>{errors.weight}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <input 
                                type="text"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                className={errors.height ? styles.inputError : ''}
                                placeholder="Height (m) *"
                            />
                            {errors.height && <span className={styles.errorMessage}>{errors.height}</span>}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
} 