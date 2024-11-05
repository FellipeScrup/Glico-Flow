'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import styles from "./meter-type.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function MeterType() {
    const router = useRouter();
    const [selectedMeter, setSelectedMeter] = useState('');
    const [selectedSensor, setSelectedSensor] = useState('');
    const [customMeter, setCustomMeter] = useState('');
    const [customSensor, setCustomSensor] = useState('');

    const meters = [
        'Accu-Chek Guide',
        'Accu-Chek Guide Me',
        'Accu-Chek Performa Connect',
        'Outro dispositivo'
    ];

    const sensors = [
        'Enlite Sensor',
        'Eversense Sensor',
        'Freestyle Libre',
        'Freestyle Navigator II',
        'G4',
        'G5',
        'G6',
        'G7',
        'Guardian Sensor',
        'Outro sensor',
        'Não uso nenhum'
    ];

    const handleSubmit = () => {
        if (selectedMeter && selectedSensor) {
            router.push('/dashboard');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.logoContainer}>
                <Image src={logo} alt="GlicoFlow Logo" width={200} height={200} priority className={styles.logo} />
            </div>

            <div className={styles.container}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Qual o seu tipo de medidor?</h2>
                    <div className={styles.selectContainer}>
                        <select
                            value={selectedMeter}
                            onChange={(e) => setSelectedMeter(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="" disabled>Selecione seu medidor</option>
                            {meters.map((meter) => (
                                <option key={meter} value={meter}>
                                    {meter}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {selectedMeter === 'Outro dispositivo' && (
                        <input
                            type="text"
                            value={customMeter}
                            onChange={(e) => setCustomMeter(e.target.value)}
                            placeholder="Digite o nome do seu medidor"
                            className={styles.input}
                            required
                        />
                    )}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Você usa sensor Glucose?</h2>
                    <div className={styles.selectContainer}>
                        <select
                            value={selectedSensor}
                            onChange={(e) => setSelectedSensor(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="" disabled>Selecione seu sensor</option>
                            {sensors.map((sensor) => (
                                <option key={sensor} value={sensor}>
                                    {sensor}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedSensor === 'Outro sensor' && (
                        <input
                            type="text"
                            value={customSensor}
                            onChange={(e) => setCustomSensor(e.target.value)}
                            placeholder="Digite o nome do seu sensor"
                            className={styles.input}
                            required
                        />
                    )}
                </div>

                <button 
                    className={styles.continueButton}
                    onClick={handleSubmit}
                    disabled={
                        !selectedMeter || 
                        !selectedSensor || 
                        (selectedMeter === 'Outro dispositivo' && !customMeter) ||
                        (selectedSensor === 'Outro sensor' && !customSensor)
                    }
                >
                    Continuar
                </button>
            </div>
        </div>
    );
} 