'use client';

import { useState } from 'react';
import styles from './NewMeasurementDialog.module.css';

export default function NewMeasurementDialog({ onClose, onSubmit }) {
  const [measurement, setMeasurement] = useState({
    glycemiaValue: '',
    mealType: '',
    measurementTime: ''
  });
  const [error, setError] = useState('');
  const [warningType, setWarningType] = useState(null);

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

  const handleGlycemiaChange = (e) => {
    const value = e.target.value;
    
    if (!/^\d*$/.test(value)) {
      return;
    }

    setMeasurement(prev => ({
      ...prev,
      glycemiaValue: value
    }));

    checkGlycemiaWarnings(value);
  };

  const checkGlycemiaWarnings = (value) => {
    if (!value) {
      setError('');
      setWarningType(null);
      return;
    }

    const numValue = Number(value);

    if (numValue >= 400) {
      setWarningType('critical-high');
      setError('ATENÇÃO! Glicemia muito elevada! Procure atendimento médico imediatamente!');
    } else if (numValue < 70) {
      setWarningType('critical-low');
      setError(`ATENÇÃO! Glicemia Baixa!

Opções Rápidas:
• Suco de laranja/uva
• Mel ou açúcar
• Balas de glicose

Meça novamente em 15min`);
    } else {
      setError('');
      setWarningType(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!measurement.glycemiaValue || !measurement.mealType || !measurement.measurementTime) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const numValue = Number(measurement.glycemiaValue);
    if (numValue < 20 || numValue > 600) {
      setError('Valor fora do intervalo permitido (20-600 mg/dL)');
      return;
    }

    onSubmit(measurement);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nova Medição</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.inputGroup}>
            <label>Valor da Glicemia</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                name="glycemiaValue"
                value={measurement.glycemiaValue}
                onChange={handleGlycemiaChange}
                placeholder="100"
                className={styles.input}
              />
              <span className={styles.unit}>mg/dL</span>
            </div>
          </div>

          {error && (
            <div className={`${styles.warning} ${styles[warningType]}`}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Refeição</label>
            <select
              name="mealType"
              value={measurement.mealType}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Selecione a refeição</option>
              {mealTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Tempo da Medição</label>
            <select
              name="measurementTime"
              value={measurement.measurementTime}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Selecione o tempo da medição</option>
              {measurementTimes.map(time => (
                <option key={time.id} value={time.id}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancelar
            </button>
            <button onClick={handleSubmit} className={styles.saveButton}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 