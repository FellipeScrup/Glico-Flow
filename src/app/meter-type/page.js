'use client';
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
    const [error, setError] = useState('');

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

    const handleSubmit = async () => {
        if (
            selectedMeter && 
            selectedSensor && 
            (selectedMeter !== 'Outro dispositivo' || customMeter) &&
            (selectedSensor !== 'Outro sensor' || customSensor)
        ) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found, user is not authorized');
                }

                const response = await fetch('http://localhost:5000/api/users/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        meterType: selectedMeter,
                        customMeter: selectedMeter === 'Outro dispositivo' ? customMeter : '',
                        sensorType: selectedSensor,
                        customSensor: selectedSensor === 'Outro sensor' ? customSensor : ''
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update user data');
                }

                const data = await response.json();
                console.log('User data updated:', data);

                // Redirect to the dashboard or next screen
                router.push('/dashboard');
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            }
        } else {
            setError('Por favor, preencha todos os campos obrigatórios');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.logoContainer}>
                <Image src={logo} alt="GlicoFlow Logo" width={200} height={200} priority className={styles.logo} />
            </div>

            <div className={styles.container}>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Qual o seu tipo de medidor?</h2>
                    <div className={styles.selectContainer}>
                        <select
                            value={selectedMeter}
                            onChange={(e) => {
                                setSelectedMeter(e.target.value);
                                setCustomMeter('');
                            }}
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
                    <h2 className={styles.sectionTitle}>Você usa sensor de glicose?</h2>
                    <div className={styles.selectContainer}>
                        <select
                            value={selectedSensor}
                            onChange={(e) => {
                                setSelectedSensor(e.target.value);
                                setCustomSensor('');
                            }}
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
