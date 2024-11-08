'use client'

import { useState } from "react";
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

    const validateFullName = (name) => {
        const names = name.trim().split(' ');
        return names.length >= 2 && names[0].length > 0 && names[1].length > 0;
    };

    const formatHeight = (value) => {
        value = value.replace(/[^\d]/g, '');
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        if (value.length >= 1) {
            value = value.slice(0, 1) + '.' + value.slice(1);
        }
        return value;
    };

    const formatWeight = (value) => {
        value = value.replace(/[^\d.]/g, '');
        if (value.length > 5) {
            value = value.slice(0, 5);
        }
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
            case 'height':
                processedValue = formatHeight(value);
                break;
            case 'weight':
                processedValue = formatWeight(value);
                break;
            case 'age':
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
    const token = localStorage.getItem('token');

// In personal-data.js
const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found, user is not authorized');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token
            },
            body: JSON.stringify({
                name: formData.name,
                age: formData.age,
                weight: formData.weight,
                height: formData.height,
                gender: formData.gender
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user profile');
        }

        const data = await response.json();
        console.log('User profile updated:', data);

        // Redirect to the next page
        router.push('/diabetes-type');
    } catch (error) {
        console.error('Error:', error);
    }
};

    

    const handleGenderSelect = (value) => {
        setFormData(prev => ({
            ...prev,
            gender: value
        }));
        setShowGenderOptions(false);
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
                <h1 className={styles.title}>Complete your profile</h1>
                
                <form onSubmit={handleProfileUpdate} className={styles.form}>
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