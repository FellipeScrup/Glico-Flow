'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './GlycemiaGoals.module.css';

export default function GlycemiaGoals({ onSave, onClose }) {
  const [goals, setGoals] = useState({
    targetMin: '',
    targetMax: '',
    hypoLimit: '',
    hyperLimit: ''
  });
  const [error, setError] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, []);

  useEffect(() => {
    const fetchExistingGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://glico-flow-api.onrender.com/api/users/goals', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const existingGoals = await response.json();
          setGoals({
            targetMin: existingGoals.targetMin.toString(),
            targetMax: existingGoals.targetMax.toString(),
            hypoLimit: existingGoals.hypoLimit.toString(),
            hyperLimit: existingGoals.hyperLimit.toString()
          });
        }
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
      }
    };

    fetchExistingGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validação dos valores
      const values = Object.values(goals);
      if (values.some(v => !v)) {
        setError('Por favor, preencha todos os campos');
        return;
      }

      const numValues = {
        targetMin: Number(goals.targetMin),
        targetMax: Number(goals.targetMax),
        hypoLimit: Number(goals.hypoLimit),
        hyperLimit: Number(goals.hyperLimit)
      };

      // Validações lógicas
      if (numValues.targetMin >= numValues.targetMax) {
        setError('O valor mínimo deve ser menor que o valor máximo');
        return;
      }

      if (numValues.hypoLimit >= numValues.targetMin) {
        setError('O limite de hipoglicemia deve ser menor que o valor mínimo alvo');
        return;
      }

      if (numValues.hyperLimit <= numValues.targetMax) {
        setError('O limite de hiperglicemia deve ser maior que o valor máximo alvo');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');

      const response = await fetch('https://glico-flow-api.onrender.com/api/users/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(numValues),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar as metas');
      }

      onSave(numValues);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container} ref={modalRef}>
        <div className={styles.header}>
          <h2 className={styles.title}>Defina suas Metas de Glicemia</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.inputGroup}>
            <label>Valor Mínimo Alvo</label>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                name="targetMin"
                value={goals.targetMin}
                onChange={handleChange}
                placeholder="70"
                className={styles.input}
              />
              <span className={styles.unit}>mg/dL</span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Valor Máximo Alvo</label>
            <input
              type="number"
              name="targetMax"
              value={goals.targetMax}
              onChange={handleChange}
              placeholder="180"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Limite de Hipoglicemia</label>
            <input
              type="number"
              name="hypoLimit"
              value={goals.hypoLimit}
              onChange={handleChange}
              placeholder="60"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Limite de Hiperglicemia</label>
            <input
              type="number"
              name="hyperLimit"
              value={goals.hyperLimit}
              onChange={handleChange}
              placeholder="200"
              className={styles.input}
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button onClick={handleSubmit} className={styles.saveButton}>
          Salvar Metas
        </button>
      </div>
    </div>
  );
} 