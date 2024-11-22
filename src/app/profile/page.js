'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        weight: '',
        height: '',
        diabetesType: '',
        diagnosisDate: '',
        treatmentType: ''
    });

    const [editedData, setEditedData] = useState({});
    const [error, setError] = useState('');

    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/signin');
                return;
            }

            const response = await fetch('https://glico-flow-api.onrender.com/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao carregar perfil');

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleEdit = () => {
        setEditedData(userData);
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Atualiza editedData em vez de userData
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://glico-flow-api.onrender.com/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editedData)
            });

            if (!response.ok) throw new Error('Falha ao atualizar dados');

            const updatedData = await response.json();
            setUserData(updatedData);
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError('Erro ao salvar alterações');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({});
        setError('');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backButton}>
                    ←
                </button>
                <h1>Perfil do Usuário</h1>
                <div className={styles.actionButtons}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className={styles.saveButton}>
                                Salvar
                            </button>
                            <button onClick={handleCancel} className={styles.cancelButton}>
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className={styles.editButton}>
                            Editar
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.profileCard}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarWrapper}>
                            <svg className={styles.avatarIcon} viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
                                        fill="currentColor"/>
                            </svg>
                        </div>
                        <h2 className={styles.userName}>{userData.name}</h2>
                        <span className={styles.userEmail}>{userData.email}</span>
                    </div>

                    <div className={styles.formContent}>
                        <div className={styles.formGroup}>
                            <label>Nome</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    name="name"
                                    value={isEditing ? editedData.name : userData.name}
                                    onChange={handleChange}
                                    className={styles.input}
                                    readOnly={!isEditing}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Idade</label>
                            <div className={styles.inputWrapper}>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="age"
                                        value={editedData.age}
                                        onChange={handleChange}
                                        className={`${styles.input} ${styles.noSpinButton}`}
                                        min="1"
                                        max="120"
                                    />
                                ) : (
                                    <div className={styles.readOnlyValue}>
                                        {userData.age} anos
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Gênero</label>
                            <div className={styles.inputWrapper}>
                                {isEditing ? (
                                    <select
                                        name="gender"
                                        value={editedData.gender}
                                        onChange={handleChange}
                                        className={styles.select}
                                    >
                                        <option value="Male">Masculino</option>
                                        <option value="Female">Feminino</option>
                                        <option value="Other">Outro</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={userData.gender}
                                        className={styles.input}
                                        readOnly
                                    />
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Peso</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    name="weight"
                                    value={isEditing ? editedData.weight : userData.weight}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.noSpinButton}`}
                                    readOnly={!isEditing}
                                />
                                {!isEditing && <span className={styles.unit}>kg</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Altura</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    name="height"
                                    value={isEditing ? editedData.height : userData.height}
                                    onChange={handleChange}
                                    className={`${styles.input} ${styles.noSpinButton}`}
                                    readOnly={!isEditing}
                                    step="0.01"
                                />
                                {!isEditing && <span className={styles.unit}>cm</span>}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Tipo de Diabetes</label>
                            <div className={styles.inputWrapper}>
                                {isEditing ? (
                                    <select
                                        name="diabetesType"
                                        value={editedData.diabetesType}
                                        onChange={handleChange}
                                        className={styles.select}
                                    >
                                        <option value="type1">Tipo 1</option>
                                        <option value="type2">Tipo 2</option>
                                        <option value="gestational">Gestacional</option>
                                        <option value="pre">Pré-diabetes</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={userData.diabetesType}
                                        className={styles.input}
                                        readOnly
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.themeToggle}>
                <label className={styles.switch}>
                    <input
                        type="checkbox"
                        checked={isDark}
                        onChange={toggleTheme}
                    />
                    <span className={styles.slider}></span>
                    <span className={styles.label}>
                        {isDark ? 'Tema Escuro' : 'Tema Claro'}
                    </span>
                </label>
            </div>
        </div>
    );
}
