'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./glycemia-ranges.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function GlycemiaRanges() {
    const router = useRouter();
    const [value, setValue] = useState('');
    const [currentRange, setCurrentRange] = useState(null);
    const [error, setError] = useState('');

    // Constantes para validação
    const MIN_GLUCOSE = 20;  // Valor mínimo aceitável
    const MAX_GLUCOSE = 600; // Valor máximo aceitável

    const handleValueChange = (e) => {
        const newValue = e.target.value;
        
        // Permite apenas números e backspace
        if (!/^\d*$/.test(newValue)) {
            return;
        }

        // Limita o comprimento a 3 dígitos
        if (newValue.length > 3) {
            return;
        }

        setValue(newValue);
        
        // Limpa erro anterior
        setError('');

        // Se o campo estiver vazio, limpa a faixa
        if (!newValue) {
            setCurrentRange(null);
            return;
        }

        const numValue = Number(newValue);

        // Valida o range
        if (numValue < MIN_GLUCOSE) {
            setError(`Valor muito baixo. Mínimo: ${MIN_GLUCOSE} mg/dL`);
            setCurrentRange(null);
            return;
        }

        if (numValue > MAX_GLUCOSE) {
            setError(`Valor muito alto. Máximo: ${MAX_GLUCOSE} mg/dL`);
            setCurrentRange(null);
            return;
        }

        // Determina a faixa
        if (numValue >= 180) {
            setCurrentRange('hyper');
        } else if (numValue >= 70 && numValue <= 179) {
            setCurrentRange('normal');
        } else if (numValue < 70) {
            setCurrentRange('hypo');
        } else {
            setCurrentRange(null);
        }
    };

// GlycemiaRanges component
const handleSubmit = async () => {
    const numValue = Number(value);

    // Final validation before submitting
    if (!value || numValue < MIN_GLUCOSE || numValue > MAX_GLUCOSE) {
        setError('Por favor, insira um valor válido');
        return;
    }

    if (currentRange) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found, user is not authorized');
            }

            const response = await fetch('http://localhost:5000/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token
                },
                body: JSON.stringify({
                    glycemiaValue: numValue,
                    glycemiaRecordedAt: new Date()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update glycemia value');
            }

            const data = await response.json();
            console.log('Glycemia value updated:', data);

            // Redirect to the next screen
            router.push('/meter-type');
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    }
};

    return (
        <div className={styles.page}>
            <div className={styles.logoContainer}>
                <Image src={logo} alt="GlicoFlow Logo" width={200} height={200} priority className={styles.logo} />
            </div>

            <div className={styles.container}>
                <h1 className={styles.title}>Sua Glicemia</h1>
                
                <div className={styles.inputContainer}>
                    <input
                        type="text" // Mudado para text para melhor controle
                        inputMode="numeric" // Abre teclado numérico em mobile
                        pattern="\d*" // Aceita apenas números
                        value={value}
                        onChange={handleValueChange}
                        className={`${styles.glucoseInput} ${error ? styles.inputError : ''}`}
                        placeholder="Digite o valor"
                    />
                    <span className={styles.unit}>mg/dL</span>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {currentRange && !error && (
                    <div className={`${styles.rangeIndicator} ${styles[currentRange]}`}>
                        {currentRange === 'hyper' && (
                            <>
                                <span className={`${styles.dot} ${styles.redDot}`}></span>
                                <span>Hiperglicemia</span>
                            </>
                        )}
                        {currentRange === 'normal' && (
                            <>
                                <span className={`${styles.dot} ${styles.greenDot}`}></span>
                                <span>Faixa Alvo</span>
                            </>
                        )}
                        {currentRange === 'hypo' && (
                            <>
                                <span className={`${styles.dot} ${styles.redDot}`}></span>
                                <span>Hipoglicemia</span>
                            </>
                        )}
                    </div>
                )}

                <button 
                    className={styles.continueButton} 
                    onClick={handleSubmit}
                    disabled={!value || !currentRange || error}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
} 