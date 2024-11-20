'use client';

import { useState } from 'react';
import styles from './GlycemiaModal.module.css';

export default function GlycemiaModal({ onClose, onSubmit }) {
    const [mealType, setMealType] = useState('');
    const [measurementTime, setMeasurementTime] = useState('');
    const [glycemiaValue, setGlycemiaValue] = useState('');
    const [error, setError] = useState('');

    const mealTypes = [
        { id: 'breakfast', label: 'Café da Manhã' },
        { id: 'lunch', label: 'Almoço' },
        { id: 'snack', label: 'Café da Tarde' },
        { id: 'dinner', label: 'Jantar' }
    ];

    const measurementTimes = [
        { id: 'before', label: '1h Antes da Refeição' },
        { id: 'after', label: '1h Após a Refeição' },
        { id: 'fasting', label: 'Jejum' },
        { id: 'bedtime', label: 'Antes de Dormir' }
    ];

    const handleSubmit = () => {
        if (!glycemiaValue || !mealType || !measurementTime) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        const numValue = Number(glycemiaValue);
        if (numValue < 20 || numValue > 600) {
            setError('Valor fora do intervalo permitido (20-600 mg/dL)');
            return;
        }

        onSubmit({
            glycemiaValue: numValue,
            mealType,
            measurementTime,
            recordedAt: new Date().toISOString()
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Nova Medição</h2>
                
                <div className={styles.inputGroup}>
                    <label>Refeição</label>
                    <select 
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Selecione a refeição</option>
                        {mealTypes.map(meal => (
                            <option key={meal.id} value={meal.id}>
                                {meal.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Momento da Medição</label>
                    <select 
                        value={measurementTime}
                        onChange={(e) => setMeasurementTime(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Selecione o momento</option>
                        {measurementTimes.map(time => (
                            <option key={time.id} value={time.id}>
                                {time.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Valor da Glicemia</label>
                    <div className={styles.inputContainer}>
                        <input
                            type="number"
                            value={glycemiaValue}
                            onChange={(e) => setGlycemiaValue(e.target.value)}
                            placeholder="Digite o valor"
                            className={styles.input}
                        />
                        <span className={styles.inputUnit}>mg/dL</span>
                    </div>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.buttonGroup}>
                    <button 
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button 
                        className={styles.confirmButton}
                        onClick={handleSubmit}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
} 