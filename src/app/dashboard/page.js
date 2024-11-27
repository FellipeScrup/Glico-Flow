'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./dashboard.module.css";
import logo from "@/assets/glicoflow-logo.png";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GlycemiaGoals from '../components/GlycemiaGoals';
import NewMeasurementDialog from '../components/NewMeasurementDialog';
import { useTheme } from '@/contexts/ThemeContext';
import HealthRecommendationsPreview from '../components/HealthRecommendationsPreview';
import ReportDialog from '../components/ReportDialog';


ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const router = useRouter();
    const [userData, setUserData] = useState({
        name: '',
        lastGlycemia: null,
        glycemiaGoal: null,
        lastMeasurement: null,
        averageGlycemia: null,
        lowestGlycemia: null,
        highestGlycemia: null,
        weeklyAverage: null,
        glycemiaGoals: null
    });
    const [error, setError] = useState('');
    const [glycemiaStats, setGlycemiaStats] = useState({
        hyper: 0,
        normal: 0,
        hypo: 0
    });
    const [showGoals, setShowGoals] = useState(false);
    const [showNewMeasurement, setShowNewMeasurement] = useState(false);
    const [isGoalsExpanded, setIsGoalsExpanded] = useState(false);
    const [isGoalsOpen, setIsGoalsOpen] = useState(false);
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [alerts, setAlerts] = useState([
        {
            id: 1,
            type: 'danger',
            title: 'Atenção! Sua glicemia está muito alta (300 mg/dL)',
            message: 'Verifique sua insulina e procure assistência médica se necessário.',
            visible: true
        },
        {
            id: 2,
            type: 'warning',
            title: 'Muitas medições fora da meta',
            message: 'Considere revisar seu tratamento com seu médico.',
            visible: true
        }
    ]);
    const [showReportDialog, setShowReportDialog] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }
        fetchUserData();
    }, [router]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById('goals-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                setIsGoalsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Usuário não autorizado');

            // Buscar medições para calcular estatísticas
            const measurementsResponse = await fetch('http://localhost:5000/api/measurements', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!measurementsResponse.ok) throw new Error('Falha ao carregar medições');

            const measurements = await measurementsResponse.json();
            
            // Calcula estatísticas baseado nas medições reais
            if (measurements.length > 0) {
                const total = measurements.length;
                const stats = measurements.reduce((acc, measurement) => {
                    const value = measurement.glycemiaValue;
                    if (value > 180) acc.hyper++;
                    else if (value >= 70 && value <= 180) acc.normal++;
                    else acc.hypo++;
                    return acc;
                }, { hyper: 0, normal: 0, hypo: 0 });

                setGlycemiaStats({
                    hyper: Number((stats.hyper / total) * 100).toFixed(1),
                    normal: Number((stats.normal / total) * 100).toFixed(1),
                    hypo: Number((stats.hypo / total) * 100).toFixed(1)
                });
            }

            // Buscar perfil e metas do usuário
            const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            // Buscar metas específicas
            const goalsResponse = await fetch('http://localhost:5000/api/users/goals', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!profileResponse.ok || !goalsResponse.ok) {
                throw new Error('Falha ao carregar dados');
            }
    
            const profileData = await profileResponse.json();
            const goalsData = await goalsResponse.json();
    
            // Gerar alertas com base nos dados
            const newAlerts = checkGlycemiaAlerts(measurements, goalsData);
            setAlerts(newAlerts);

            // Atualiza os dados do usuário incluindo as metas
            setUserData({
                ...profileData,
                glycemiaGoals: goalsData // Adiciona as metas ao userData
            });
        } catch (error) {
            console.error('Erro:', error);
            setError(error.message);
        }
    };

    const calculateGlycemiaStats = (measurements) => {
        const total = measurements.length;
        const stats = measurements.reduce((acc, measurement) => {
            const value = measurement.glycemiaValue;
            if (value >= 180) acc.hyper++;
            else if (value >= 70 && value <= 179) acc.normal++;
            else if (value < 70) acc.hypo++;
            return acc;
        }, { hyper: 0, normal: 0, hypo: 0 });

        setGlycemiaStats({
            hyper: ((stats.hyper / total) * 100).toFixed(1),
            normal: ((stats.normal / total) * 100).toFixed(1),
            hypo: ((stats.hypo / total) * 100).toFixed(1)
        });
    };

    const chartData = {
        labels: ['Hiperglicemia', 'Faixa Alvo', 'Hipoglicemia'],
        datasets: [{
            data: [
                Number(glycemiaStats.hyper) || 0,
                Number(glycemiaStats.normal) || 0,
                Number(glycemiaStats.hypo) || 0
            ],
            backgroundColor: ['#FF6B6B', '#4ECB71', '#FFE44D'],
            borderWidth: 0
        }]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        const value = Number(context.raw).toFixed(1);
                        return `${context.label}: ${value}%`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        }
    };

    const getGlycemiaStatus = (value) => {
        if (value >= 180) return { status: 'Hiperglicemia', color: '#FF6B6B' };
        if (value >= 70 && value <= 179) return { status: 'Faixa Alvo', color: '#4ECB71' };
        return { status: 'Hipoglicemia', color: '#FFE44D' };
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.replace('/login');
    };
    
    const handleNewMeasurement = async (measurementData) => {
        try {
            // Implementar a lógica de salvar a medição
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/measurements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(measurementData),
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar medição');
            }

            // Atualizar os dados do dashboard
            fetchUserData();
            setShowNewMeasurement(false);
        } catch (error) {
            console.error('Erro ao salvar medição:', error);
        }
    };

    const handleChartClick = () => {
        setIsChartOpen(!isChartOpen);
        
        // Se estiver abrindo o gráfico, faz o scroll
        if (!isChartOpen) {
            setTimeout(() => {
                const chartElement = document.getElementById('chart-section');
                if (chartElement) {
                    const yOffset = -100; // Ajuste este valor conforme necessário
                    const y = chartElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    
                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }
            }, 100); // Pequeno delay para garantir que a expansão começou
        }
    };

    const checkGlycemiaAlerts = (measurements, goals) => {
        if (!measurements.length || !goals) return [];
      
        const newAlerts = [];
        let idCounter = Date.now(); // Inicia com um timestamp para garantir unicidade
      
        const lastMeasurement = measurements[0]; // Última medição
        const lastValue = lastMeasurement.glycemiaValue;
      
        // Alerta para hipoglicemia severa
        if (lastValue < goals.hypoLimit) {
          newAlerts.push({
            id: idCounter++,
            type: 'danger',
            icon: '⚠️',
            title: `Atenção! Sua glicemia está muito baixa (${lastValue} mg/dL)`,
            message: 'Consuma carboidratos de rápida absorção imediatamente.'
          });
        }
      
        // Alerta para hiperglicemia severa
        if (lastValue > goals.hyperLimit) {
          newAlerts.push({
            id: idCounter++,
            type: 'danger',
            icon: '⚠️',
            title: `Atenção! Sua glicemia está muito alta (${lastValue} mg/dL)`,
            message: 'Verifique sua insulina e procure assistência médica se necessário.'
          });
        }
      
        // Alerta para tendência de hipoglicemia
        const recentMeasurements = measurements.slice(0, 3); // Últimas 3 medições
        if (recentMeasurements.length >= 3) {
          const isDecreasing = recentMeasurements.every((m, i, arr) => {
            if (i === arr.length - 1) return true;
            return m.glycemiaValue < arr[i + 1].glycemiaValue;
          });
      
          if (isDecreasing && lastValue < goals.targetMin) {
            newAlerts.push({
              id: idCounter++,
              type: 'warning',
              icon: '📉',
              title: 'Tendência de queda na glicemia detectada',
              message: 'Monitore seus níveis com mais frequência.'
            });
          }
        }
      
        // Alerta para muitas medições fora da meta
        const outOfRangeCount = measurements
          .slice(0, 10) // Últimas 10 medições
          .filter(m => m.glycemiaValue < goals.targetMin || m.glycemiaValue > goals.targetMax)
          .length;
      
        if (outOfRangeCount >= 7) { // 70% fora da meta
          newAlerts.push({
            id: idCounter++,
            type: 'warning',
            icon: '📊',
            title: 'Muitas medições fora da meta',
            message: 'Considere revisar seu tratamento com seu médico.'
          });
        }
      
        return newAlerts;
      };
      

    const Alert = ({ id, type, title, message, onClose }) => {
        const [isClosing, setIsClosing] = useState(false);

        const handleClose = () => {
            setIsClosing(true);
            setTimeout(() => {
                onClose(id);
            }, 300);
        };

        return (
            <div className={`${styles.alert} ${styles[type]} ${isClosing ? styles.closing : ''}`}>
                <div className={styles.alertContent}>
                    <div className={styles.alertIcon}>
                        {type === 'danger' ? '⚠️' : '📊'}
                    </div>
                    <div className={styles.alertText}>
                        <h4>{title}</h4>
                        <p>{message}</p>
                    </div>
                </div>
                <button onClick={handleClose} className={styles.closeButton}>
                    ×
                </button>
            </div>
        );
    };

    const handleCloseAlert = (alertId) => {
        setAlerts(prevAlerts => 
            prevAlerts.filter(alert => alert.id !== alertId)
        );
    };

    const MeasurementStats = ({ stats }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <div className={styles.measurementCard}>
                <button 
                    className={styles.cardHeader} 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className={styles.headerLeft}>
                        <span className={styles.cardIcon}>📊</span>
                        <h3 className={styles.cardTitle}>Dados de Medição</h3>
                    </div>
                    <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
                        ▼
                    </span>
                </button>

                {isExpanded && (
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Média</span>
                            <span className={styles.statValue}>{stats.average}</span>
                            <span className={styles.statUnit}>mg/dL</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Menor</span>
                            <span className={styles.statValue}>{stats.lowest}</span>
                            <span className={styles.statUnit}>mg/dL</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Maior</span>
                            <span className={styles.statValue}>{stats.highest}</span>
                            <span className={styles.statUnit}>mg/dL</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Média Semanal</span>
                            <span className={styles.statValue}>{stats.weeklyAverage}</span>
                            <span className={styles.statUnit}>mg/dL</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Componente de estatísticas
    const StatsLegend = () => {
        return (
            <div className={styles.statsLegend}>
                <div className={styles.legendItem}>
                    <span className={styles.dot} style={{ backgroundColor: '#FF6B6B' }}></span>
                    <span>Hiperglicemia</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.dot} style={{ backgroundColor: '#4ECB71' }}></span>
                    <span>Faixa Alvo</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.dot} style={{ backgroundColor: '#FFE44D' }}></span>
                    <span>Hipoglicemia</span>
                </div>
            </div>
        );
    };

    const StatsValues = ({ stats }) => {
        return (
            <div className={styles.statsValues}>
                <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                        <span className={styles.dot} style={{ backgroundColor: '#FF6B6B' }}></span>
                        <span>Hiperglicemia:</span>
                    </div>
                    <span className={styles.statValue}>{stats.hyper}%</span>
                </div>
                <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                        <span className={styles.dot} style={{ backgroundColor: '#4ECB71' }}></span>
                        <span>Faixa Alvo:</span>
                    </div>
                    <span className={styles.statValue}>{stats.normal}%</span>
                </div>
                <div className={styles.statRow}>
                    <div className={styles.statLabel}>
                        <span className={styles.dot} style={{ backgroundColor: '#FFE44D' }}></span>
                        <span>Hipoglicemia:</span>
                    </div>
                    <span className={styles.statValue}>{stats.hypo}%</span>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <header className={`${styles.header} ${styles.slideDown}`}>
                <div className={styles.logoContainer}>
                    <div className={styles.userSection}>
                        <div className={styles.profileIconWrapper}>
                            <button 
                                onClick={() => router.push('/profile')} 
                                className={styles.profileButton}
                                title="Ver perfil"
                            >
                                <div className={styles.profileIcon}>
                                    <div className={styles.profileCircle}></div>
                                    <div className={styles.profileBody}></div>
                                </div>
                            </button>
                        </div>
                        <span className={styles.userName}>{userData.name}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Sair
                </button>
            </header>

            {alerts.length > 0 && (
                <div className={styles.alertsContainer}>
                    {alerts.map((alert) => (
                        <Alert
                            key={alert.id}
                            id={alert.id}
                            type={alert.type}
                            title={alert.title}
                            message={alert.message}
                            onClose={handleCloseAlert}
                        />
                    ))}
                </div>
            )}

            <div className={`${styles.mainCard} ${styles.fadeIn}`}>
                <div className={styles.glycemiaValue}>
                    <span className={styles.number}>{userData.lastGlycemia || '--'}</span>
                    <span className={styles.unit}>mg/dL</span>
                </div>
                <div className={styles.measurementTime}>
                    Última medição: {userData.lastMeasurement ? 
                        new Date(userData.lastMeasurement).toLocaleString('pt-BR') : 
                        'Sem medições'}
                </div>
                {userData.lastGlycemia && (
                    <div className={`${styles.statusBadge} ${styles.pulseAnimation}`}
                         style={{ backgroundColor: getGlycemiaStatus(userData.lastGlycemia).color }}>
                        {getGlycemiaStatus(userData.lastGlycemia).status}
                    </div>
                )}
            </div>

            <MeasurementStats 
                stats={{
                    average: userData.averageGlycemia,
                    lowest: userData.lowestGlycemia,
                    highest: userData.highestGlycemia,
                    weeklyAverage: userData.weeklyAverage
                }} 
            />

            <div className={styles.goalsWrapper}>
                <div className={styles.goalsHeader} onClick={() => setIsGoalsOpen(!isGoalsOpen)}>
                    <div className={styles.headerContent}>
                        <div className={styles.bolts}>
                            <span className={styles.bolt}>⚡</span>
                            <span className={styles.bolt}>⚡</span>
                        </div>
                        <span className={styles.headerText}>Metas de Glicemia</span>
                        <span className={`${styles.arrow} ${isGoalsOpen ? styles.expanded : ''}`}>▼</span>
                    </div>
                </div>
                
                <div className={`${styles.goalsContent} ${isGoalsOpen ? styles.expanded : ''}`}>
                    <div className={styles.goalItem}>
                        <span>Hipoglicemia:</span>
                        <span>{userData.glycemiaGoals?.hypoLimit || '--'} mg/dL</span>
                    </div>
                    <div className={styles.goalItem}>
                        <span>Faixa Ideal:</span>
                        <span>
                            {userData.glycemiaGoals ? 
                                `${userData.glycemiaGoals.targetMin} - ${userData.glycemiaGoals.targetMax}` : '--'} mg/dL
                        </span>
                    </div>
                    <div className={styles.goalItem}>
                        <span>Hiperglicemia:</span>
                        <span>{userData.glycemiaGoals?.hyperLimit || '--'} mg/dL</span>
                    </div>
                </div>
            </div>

            <div className={styles.chartWrapper} id="chart-section">
                <div 
                    className={styles.chartHeader} 
                    onClick={handleChartClick} 
                >
                    <div className={styles.headerContent}>
                        <span className={styles.chartIcon}>📊</span>
                        <span className={styles.headerText}>Distribuição Glicêmica</span>
                        <span className={`${styles.arrow} ${isChartOpen ? styles.expanded : ''}`}>▼</span>
                    </div>
                </div>
                
                <div className={`${styles.chartContent} ${isChartOpen ? styles.expanded : ''}`}>
                    <div className={styles.chartContainer}>
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                    <div className={styles.legendContainer}>
                        <div className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ backgroundColor: '#FF8B9A' }}></span>
                            <span>Hiperglicemia</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ backgroundColor: '#54DCC3' }}></span>
                            <span>Faixa Alvo</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ backgroundColor: '#FFD66B' }}></span>
                            <span>Hipoglicemia</span>
                        </div>
                    </div>
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>
                                <span className={styles.legendDot} style={{ backgroundColor: '#FF8B9A' }}></span>
                                Hiperglicemia:
                            </span>
                            <span className={styles.statValue}>{glycemiaStats.hyper}%</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>
                                <span className={styles.legendDot} style={{ backgroundColor: '#54DCC3' }}></span>
                                Faixa Alvo:
                            </span>
                            <span className={styles.statValue}>{glycemiaStats.normal}%</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>
                                <span className={styles.legendDot} style={{ backgroundColor: '#FFD66B' }}></span>
                                Hipoglicemia:
                            </span>
                            <span className={styles.statValue}>{glycemiaStats.hypo}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <HealthRecommendationsPreview />

            <div className={styles.modernButtons}>
                <button 
                    onClick={() => setShowNewMeasurement(true)}
                    className={`${styles.primaryButton} ${styles.modernPrimary}`}
                >
                    Nova Medição
                </button>

                <button 
                    onClick={() => setShowGoals(true)} 
                    className={`${styles.secondaryButton} ${styles.modernSecondary}`}
                >
                    ⚡ Definir Metas
                </button>

                <button 
                    onClick={() => setShowReportDialog(true)}
                    className={`${styles.secondaryButton} ${styles.modernSecondary}`}
                >
                    📊 Exportar Relatório
                </button>
            </div>

            {showGoals && (
                <GlycemiaGoals 
                    onSave={(goals) => {
                        setShowGoals(false);
                        fetchUserData();
                    }}
                    onClose={() => setShowGoals(false)}
                />
            )}

            {showNewMeasurement && (
                <NewMeasurementDialog
                    onClose={() => setShowNewMeasurement(false)}
                    onSubmit={handleNewMeasurement}
                />
            )}

            {showReportDialog && (
                <ReportDialog onClose={() => setShowReportDialog(false)} />
            )}
        </div>
    );
}


