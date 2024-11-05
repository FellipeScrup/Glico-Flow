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

    const handleSubmit = () => {
        const numValue = Number(value);
        
        // Validação final antes de submeter
        if (!value || numValue < MIN_GLUCOSE || numValue > MAX_GLUCOSE) {
            setError('Por favor, insira um valor válido');
            return;
        }

        if (currentRange) {
            router.push('/meter-type');
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