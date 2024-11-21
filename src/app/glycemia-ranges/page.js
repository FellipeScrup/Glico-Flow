// glycemia-ranges.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./glycemia-ranges.module.css";
import logo from "@/assets/glicoflow-logo.png";

export default function GlycemiaRanges() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [currentRange, setCurrentRange] = useState(null);
  const [error, setError] = useState("");
  const [mealType, setMealType] = useState("");
  const [measurementTime, setMeasurementTime] = useState("");

  // Constantes para validação
  const MIN_GLUCOSE = 20; // Valor mínimo aceitável
  const MAX_GLUCOSE = 600; // Valor máximo aceitável

  const mealTypes = [
    { id: "breakfast", label: "Café da Manhã" },
    { id: "lunch", label: "Almoço" },
    { id: "snack", label: "Café da Tarde" },
    { id: "dinner", label: "Jantar" },
  ];

  const measurementTimes = [
    { id: "before", label: "1h Antes da Refeição" },
    { id: "after", label: "1h Após a Refeição" },
    { id: "fasting", label: "Jejum" },
    { id: "bedtime", label: "Antes de Dormir" },
  ];

  const handleValueChange = (e) => {
    const newValue = e.target.value;

    if (!/^\d*$/.test(newValue)) {
      return;
    }

    setValue(newValue);
    setError("");

    if (!newValue) {
      setCurrentRange(null);
      return;
    }

    const numValue = Number(newValue);

    if (numValue >= 400) {
      setError(
        "ATENÇÃO! Glicemia muito elevada! Procure atendimento médico imediatamente!"
      );
      setCurrentRange("critical-high");
    } else if (numValue < 70) {
      setError(`ATENÇÃO! Glicemia Baixa!

Opções Rápidas:
• Suco de laranja/uva
• Mel ou açúcar
• Balas de glicose

Meça novamente em 15min`);
      setCurrentRange("critical-low");
    }
    // Define os ranges normais
    if (numValue >= 180) {
      setCurrentRange("hyper");
    } else if (numValue >= 70 && numValue <= 179) {
      setCurrentRange("normal");
    } else if (numValue < 70) {
      setCurrentRange("hypo");
    }
  };

  const handleSubmit = async () => {
    const numValue = Number(value);

    if (!value) {
      setError("Por favor, insira um valor");
      return;
    }

    if (!mealType || !measurementTime) {
      setError("Por favor, selecione a refeição e o momento da medição");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await fetch("https://glico-flow-api.onrender.com/api/measurements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          glycemiaValue: numValue,
          mealType,
          measurementTime,
          recordedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao adicionar medição");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro:", error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.logoContainer}>
        <Image
          src={logo}
          alt="GlicoFlow Logo"
          width={200}
          height={200}
          priority
          className={styles.logo}
        />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>Sua Glicemia</h1>
        <div className={styles.inputContainer}>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleValueChange}
            className={`${styles.glucoseInput} ${error ? styles.inputError : ""}`}
            placeholder="Digite o valor"
            min="0"
            max="600"
            step="1"
          />
          <span className={styles.unit}>mg/dL</span>
        </div>
        {error && (
          <div
            className={`${styles.errorMessage} ${
              currentRange === "critical-high"
                ? styles.criticalHigh
                : currentRange === "critical-low"
                ? styles.criticalLow
                : ""
            }`}
          >
            {error}
          </div>
        )}
        {currentRange && !error && (
          <div className={`${styles.rangeIndicator} ${styles[currentRange]}`}>
            {currentRange === "hyper" && (
              <>
                <span className={`${styles.dot} ${styles.redDot}`}></span>
                <span>Hiperglicemia</span>
              </>
            )}
            {currentRange === "normal" && (
              <>
                <span className={`${styles.dot} ${styles.greenDot}`}></span>
                <span>Faixa Alvo</span>
              </>
            )}
            {currentRange === "hypo" && (
              <>
                <span className={`${styles.dot} ${styles.redDot}`}></span>
                <span>Hipoglicemia</span>
              </>
            )}
          </div>
        )}
        <div className={styles.selectGroup}>
          <label>Refeição</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className={styles.select}
          >
            <option value="">Selecione a refeição</option>
            {mealTypes.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.selectGroup}>
          <label>Momento da Medição</label>
          <select
            value={measurementTime}
            onChange={(e) => setMeasurementTime(e.target.value)}
            className={styles.select}
          >
            <option value="">Selecione o momento</option>
            {measurementTimes.map((time) => (
              <option key={time.id} value={time.id}>
                {time.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleSubmit} className={styles.continueButton}>
          Continuar
        </button>
      </div>
    </div>
  );
}
