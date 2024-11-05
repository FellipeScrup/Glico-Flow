'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./diabetes-type.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function DiabetesType() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState('');
    const [selectedTreatment, setSelectedTreatment] = useState('');
    const [medication, setMedication] = useState('');
    const [glycemiaUnit, setGlycemiaUnit] = useState('');
    const [carbUnit, setCarbUnit] = useState('');
    const [error, setError] = useState('');

    const diabetesTypes = [
        { id: 'tipo1', label: 'TIPO 1' },
        { id: 'tipo2', label: 'TIPO 2' },
        { id: 'pre', label: 'PRÉ DIABETES' },
        { id: 'gestacional', label: 'GESTACIONAL' }
    ];

    const treatmentTypes = [
        { id: 'caneta_seringa', label: 'CANETA / SERINGAS' },
        { id: 'bomba', label: 'BOMBA' },
        { id: 'sem_insulina', label: 'SEM INSULINA' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedType || !selectedTreatment || !medication || !glycemiaUnit || !carbUnit) {
            setError('Por favor, preencha todos os campos');
            return;
        }
        router.push('/glycemia-ranges');
    };

    return (
        <div className={styles.page}>
            <div className={styles.logoContainer}>
                <Image
                    src={logo}
                    alt="GlicoFlow Logo"
                    width={180}
                    height={167}
                    priority
                    className={styles.logo}
                />
            </div>

            <form onSubmit={handleSubmit} className={styles.container}>
                <div className={styles.form}>
                    {/* Primeiro: Tipo de Diabetes */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="diabetesType" className={styles.label}>
                            Tipo de Diabetes
                        </label>
                        <select
                            id="diabetesType"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className={styles.select}
                        >
                            <option value="" disabled>Selecione o tipo de diabetes</option>
                            {diabetesTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Segundo: Método de Tratamento */}
                    {selectedType && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="treatmentType" className={styles.label}>
                                Qual o seu método de tratamento?
                            </label>
                            <select
                                id="treatmentType"
                                value={selectedTreatment}
                                onChange={(e) => setSelectedTreatment(e.target.value)}
                                className={styles.select}
                            >
                                <option value="" disabled>Selecione o método de tratamento</option>
                                {treatmentTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Terceiro: Medicamentos */}
                    {selectedTreatment && (
                        <div className={styles.medicationGroup}>
                            <label className={styles.label}>
                                Você toma algum medicamento?
                            </label>
                            <div className={styles.radioGroup}>
                                <div 
                                    className={`${styles.radioOption} ${medication === 'sim' ? styles.selected : ''}`}
                                    onClick={() => setMedication('sim')}
                                >
                                    <label>SIM</label>
                                </div>
                                <div 
                                    className={`${styles.radioOption} ${medication === 'nao' ? styles.selected : ''}`}
                                    onClick={() => setMedication('nao')}
                                >
                                    <label>NÃO</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quarto: Unidades (após selecionar sim ou não) */}
                    {medication && (
                        <div className={styles.unitsGroup}>
                            <div className={styles.unitSection}>
                                <label className={styles.label}>GLICEMIA</label>
                                <div className={styles.radioGroup}>
                                    <div 
                                        className={`${styles.radioOption} ${glycemiaUnit === 'mg/dL' ? styles.selected : ''}`}
                                        onClick={() => setGlycemiaUnit('mg/dL')}
                                    >
                                        <label>mg/dL</label>
                                    </div>
                                    <div 
                                        className={`${styles.radioOption} ${glycemiaUnit === 'mmol/L' ? styles.selected : ''}`}
                                        onClick={() => setGlycemiaUnit('mmol/L')}
                                    >
                                        <label>mmol/L</label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.unitSection}>
                                <label className={styles.label}>CARBOIDRATOS</label>
                                <div className={styles.radioGroup}>
                                    <div 
                                        className={`${styles.radioOption} ${carbUnit === 'g' ? styles.selected : ''}`}
                                        onClick={() => setCarbUnit('g')}
                                    >
                                        <label>g</label>
                                    </div>
                                    <div 
                                        className={`${styles.radioOption} ${carbUnit === 'ex' ? styles.selected : ''}`}
                                        onClick={() => setCarbUnit('ex')}
                                    >
                                        <label>ex</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <span className={styles.errorMessage}>{error}</span>}
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