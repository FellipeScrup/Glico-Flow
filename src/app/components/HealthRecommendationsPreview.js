import { useRouter } from 'next/navigation';
import styles from './HealthRecommendationsPreview.module.css';

export default function HealthRecommendationsPreview() {
  const router = useRouter();

  return (
    <div className={styles.previewCard} onClick={() => router.push('/health-recommendations')}>
      <div className={styles.header}>
        <span className={styles.icon}>💪</span>
        <h3>Recomendações de Saúde</h3>
        <span className={styles.arrow}>▶</span>
      </div>
      
      <div className={styles.previewContent}>
        <div className={styles.exercisePreview}>
          <span className={styles.exerciseIcon}>🏃‍♂️</span>
          <div className={styles.exerciseText}>
            <p>Exercícios Recomendados</p>
            <span>Caminhada Moderada, Natação, Musculação</span>
          </div>
        </div>
      </div>
    </div>
  );
} 