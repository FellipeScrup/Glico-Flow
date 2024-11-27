'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './health-recommendations.module.css';

export default function HealthRecommendations() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('exercise');
  const [userData, setUserData] = useState(null);
  const [glycemiaData, setGlycemiaData] = useState({
    lastMeasurement: null,
    glycemiaGoals: null
  });
  const [recommendations, setRecommendations] = useState({
    exercise: [],
    nutrition: null
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      // Buscar perfil do usuário
      const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) throw new Error('Falha ao carregar perfil');
      const profile = await profileResponse.json();

      // Buscar medições
      const measurementsResponse = await fetch('http://localhost:5000/api/measurements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!measurementsResponse.ok) throw new Error('Falha ao carregar medições');
      const measurements = await measurementsResponse.json();

      // Buscar metas específicas
      const goalsResponse = await fetch('http://localhost:5000/api/users/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!goalsResponse.ok) throw new Error('Falha ao carregar metas');
      const goals = await goalsResponse.json();

      setGlycemiaData({
        lastMeasurement: measurements[0]?.glycemiaValue || null,
        glycemiaGoals: goals
      });

      // Atualizar recomendações baseadas nos dados completos do usuário
      const exerciseRecs = getExerciseRecommendations({
        ...profile, // Agora inclui o gênero do usuário
        glycemiaGoals: goals,
        lastMeasurement: measurements[0]
      }, measurements[0]?.glycemiaValue);

      setRecommendations(prev => ({
        ...prev,
        exercise: exerciseRecs
      }));

      setUserData(profile); // Armazena todos os dados do perfil, incluindo o gênero

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getGlycemiaStatus = (value) => {
    if (!value || !glycemiaData.glycemiaGoals) return 'normal';
    
    const { hyperLimit, hypoLimit } = glycemiaData.glycemiaGoals;
    
    if (value >= hyperLimit) return 'high';
    if (value <= hypoLimit) return 'low';
    return 'normal';
  };

  const renderEmergencyAlert = () => {
    const status = getGlycemiaStatus(glycemiaData.lastMeasurement);
    
    if (status === 'normal') return null;

    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${styles.emergencyAlert} ${styles[status]}`}
      >
        {status === 'high' ? (
          <>
            <div className={styles.alertHeader}>
              <span className={styles.alertIcon}>⚠️</span>
              <h2>Alerta de Hiperglicemia</h2>
            </div>
            <div className={styles.alertContent}>
              <p className={styles.alertValue}>
                Sua glicemia está em {glycemiaData.lastMeasurement} mg/dL
              </p>
              <div className={styles.immediateActions}>
                <h4>Ações Imediatas:</h4>
                <ul>
                  <li>Verifique sua insulina conforme prescrição médica</li>
                  <li>Beba água em abundância</li>
                  <li>Evite exercícios intensos neste momento</li>
                  <li>Monitore sua glicemia a cada 2 horas</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.alertHeader}>
              <span className={styles.alertIcon}>🚨</span>
              <h2>Alerta de Hipoglicemia</h2>
            </div>
            <div className={styles.alertContent}>
              <p className={styles.alertValue}>
                Sua glicemia está em {glycemiaData.lastMeasurement} mg/dL
              </p>
              <div className={styles.immediateActions}>
                <h4>Ações Imediatas:</h4>
                <ul>
                  <li>Consuma 15g de carboidrato de rápida absorção</li>
                  <li>Aguarde 15 minutos e meça novamente</li>
                  <li>Evite atividades físicas até normalizar</li>
                  <li>Se não melhorar, procure atendimento médico</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  const getExerciseRecommendations = (userData, glycemia) => {
    const status = getGlycemiaStatus(glycemia);
    const age = userData?.age || 30;
    const imc = userData ? (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1) : 25;
    const gender = userData?.gender || 'Male'; // Usa o gênero do perfil
    const diabetesType = userData?.diabetesType || 'type2';
    
    // Função auxiliar para determinar intensidade baseada no perfil
    const getIntensityLevel = () => {
      if (age > 60) return 'Leve a Moderada';
      if (imc > 30) return 'Leve, progredindo gradualmente';
      if (diabetesType === 'type1') return 'Moderada com monitoramento frequente';
      return 'Moderada a Alta';
    };

    // Verifica contraindicações
    if (status === 'low') {
      return [{
        title: '⚠️ Exercícios Contraindicados',
        description: 'Não realize atividades físicas neste momento',
        warning: `Glicemia atual: ${glycemia} mg/dL - Muito Baixa`,
        instructions: [
          'Interrompa qualquer atividade física imediatamente',
          'Consuma 15g de carboidrato de rápida absorção',
          'Aguarde a normalização da glicemia (> 100 mg/dL)',
          'Só retome após 30 minutos da correção'
        ]
      }];
    }

    if (status === 'high') {
      return [{
        title: '⚠️ Atenção - Glicemia Elevada',
        warning: `Glicemia atual: ${glycemia} mg/dL - Alta`,
        recommendations: [
          {
            title: '🚶‍♂️ Caminhada Leve',
            duration: '10-15 minutos',
            intensity: 'Muito leve',
            warning: 'Apenas após verificar cetonas e aplicar insulina se necessário',
            notes: 'Mantenha-se bem hidratado'
          },
          {
            title: '🧘‍♂️ Exercícios de Relaxamento',
            duration: '5-10 minutos',
            type: 'Respiração e alongamento leve',
            frequency: 'A cada 2 horas',
            notes: 'Ajuda a reduzir o estresse e a glicemia'
          }
        ]
      }];
    }

    // Recomendações personalizadas baseadas no perfil
    const baseIntensity = getIntensityLevel();
    const recommendations = [];

    // Exercícios Cardiovasculares
    const cardioRec = {
      title: '🫀 Exercícios Cardiovasculares',
      description: `Atividades aeróbicas adaptadas ao perfil ${gender === 'Female' ? 'feminino' : 'masculino'}`,
      frequency: diabetesType === 'type1' ? '3-4x por semana' : '4-5x por semana',
      options: []
    };

    // Definir opções baseadas no gênero
    if (gender === 'Female') {
      if (imc <= 25) {
        cardioRec.options.push(
          {
            type: '💃 Dança',
            duration: '30-45 minutos',
            intensity: baseIntensity
          },
          {
            type: '🚴‍♀️ Spinning',
            duration: '30-40 minutos',
            intensity: baseIntensity
          }
        );
      } else {
        cardioRec.options.push(
          {
            type: '🏊‍♀️ Hidroginástica',
            duration: '45 minutos',
            intensity: 'Leve a Moderada'
          },
          {
            type: '🚶‍♀️ Caminhada',
            duration: '30 minutos',
            intensity: 'Leve, aumentando gradualmente'
          }
        );
      }
    } else {
      if (imc <= 25) {
        cardioRec.options.push(
          {
            type: '🏃‍♂️ Corrida',
            duration: '30-45 minutos',
            intensity: baseIntensity
          },
          {
            type: '🚴‍♂️ Ciclismo',
            duration: '45-60 minutos',
            intensity: baseIntensity
          }
        );
      } else {
        cardioRec.options.push(
          {
            type: '🚶‍♂️ Caminhada',
            duration: '45 minutos',
            intensity: 'Leve, aumentando gradualmente'
          },
          {
            type: '🏊‍♂️ Natação',
            duration: '30 minutos',
            intensity: 'Leve a Moderada'
          }
        );
      }
    }

    recommendations.push(cardioRec);

    // Treino de Força específico por gênero
    const strengthRec = {
      title: '💪 Treino de Força',
      description: `Fortalecimento muscular adaptado ao perfil ${gender === 'Female' ? 'feminino' : 'masculino'}`,
      frequency: gender === 'Female' ? '3-4x por semana' : '4-5x por semana'
    };

    if (gender === 'Female') {
      strengthRec.exercises = [
        {
          type: 'Musculação com pesos',
          sets: '3-4 séries',
          reps: '8-12 repetições',
          intensity: 'Leve, progredindo gradualmente',
          rest: '60-90 segundos entre séries',
          focus: [
            'Fortalecimento de membros inferiores',
            'Exercícios para core e postura',
            'Fortalecimento do assoalho pélvico'
          ],
          exercises: [
            'Agachamento',
            'Leg Press',
            'Cadeira Extensora',
            'Cadeira Flexora',
            'Elevação Pélvica',
            'Abdominais',
            'Exercícios para costas'
          ]
        }
      ];
    } else {
      strengthRec.exercises = [
        {
          type: 'Musculação com pesos',
          sets: '3-4 séries',
          reps: age > 50 ? '12-15 repetições' : '8-12 repetições',
          intensity: baseIntensity,
          rest: '90-120 segundos entre séries',
          focus: [
            'Desenvolvimento de força muscular',
            'Hipertrofia muscular',
            'Fortalecimento do core',
            'Estabilidade articular'
          ],
          exercises: [
            {
              name: 'Treino A - Superior',
              exercises: [
                'Supino reto com barra',
                'Puxada frontal',
                'Desenvolvimento de ombros',
                'Remada curvada',
                'Extensão triceps na polia',
                'Rosca direta com barra'
              ]
            },
            {
              name: 'Treino B - Inferior',
              exercises: [
                'Agachamento livre',
                'Leg press 45°',
                'Cadeira extensora',
                'Mesa flexora',
                'Panturrilha em pé',
                'Abdominais'
              ]
            }
          ],
          notes: [
            'Alternar entre treino A e B',
            'Aumentar carga progressivamente',
            'Manter forma correta dos exercícios',
            'Hidratação constante durante treino'
          ]
        }
      ];
    }

    recommendations.push(strengthRec);

    // Flexibilidade e Equilíbrio específico por gênero
    const flexibilityRec = {
      title: gender === 'Female' ? '🧘‍♀️ Flexibilidade e Bem-estar' : '🧘‍♂️ Flexibilidade e Equilíbrio',
      description: gender === 'Female' ? 
        'Exercícios complementares focados no público feminino' : 
        'Exercícios complementares focados no público masculino',
      frequency: '2-3x por semana'
    };

    if (gender === 'Female') {
      flexibilityRec.activities = [
        {
          type: 'Yoga Flow',
          duration: '30-45 minutos',
          benefits: [
            'Melhora da flexibilidade',
            'Redução do estresse',
            'Fortalecimento do core',
            'Equilíbrio hormonal'
          ]
        },
        {
          type: 'Pilates',
          duration: '45-60 minutos',
          benefits: [
            'Fortalecimento do core',
            'Melhora da postura',
            'Controle respiratório'
          ]
        },
        {
          type: 'Alongamentos',
          duration: '10-15 minutos',
          timing: 'Após exercícios principais',
          focus: [
            'Membros inferiores',
            'Região lombar',
            'Ombros e pescoço'
          ]
        }
      ];
    } else {
      flexibilityRec.activities = [
        {
          type: 'Yoga para Atletas',
          duration: '30-40 minutos',
          benefits: [
            'Melhora da flexibilidade muscular',
            'Prevenção de lesões',
            'Recuperação muscular',
            'Equilíbrio corporal'
          ],
          recommended: [
            'Power Yoga',
            'Yoga para Esportistas',
            'Posturas de força e equilíbrio'
          ]
        },
        {
          type: 'Alongamento Dinâmico',
          duration: '15-20 minutos',
          timing: 'Antes dos exercícios principais',
          focus: [
            'Mobilidade articular',
            'Preparação muscular',
            'Aquecimento progressivo'
          ]
        },
        {
          type: 'Alongamento Estático',
          duration: '10-15 minutos',
          timing: 'Após exercícios principais',
          focus: [
            'Grandes grupos musculares',
            'Redução da tensão muscular',
            'Melhora da recuperação'
          ],
          areas: [
            'Peitoral e ombros',
            'Costas',
            'Quadríceps e posteriores',
            'Core'
          ]
        }
      ];

      // Adiciona recomendações específicas para mobilidade
      flexibilityRec.mobilityWork = {
        type: 'Trabalho de Mobilidade',
        frequency: '2x por semana',
        duration: '15-20 minutos',
        exercises: [
          'Mobilidade de quadril',
          'Mobilidade escapular',
          'Mobilidade de tornozelo',
          'Exercícios com foam roller'
        ],
        benefits: [
          'Melhora da amplitude de movimento',
          'Prevenção de lesões',
          'Otimização do desempenho nos exercícios'
        ]
      };
    }

    recommendations.push(flexibilityRec);

    if (gender === 'Male') {
      recommendations.push({
        title: '🔄 Recuperação e Regeneração',
        description: 'Estratégias para otimizar a recuperação muscular',
        frequency: 'Conforme necessário',
        activities: [
          {
            type: 'Descanso Ativo',
            duration: '20-30 minutos',
            options: [
              'Caminhada leve',
              'Natação recreativa',
              'Ciclismo leve'
            ]
          },
          {
            type: 'Técnicas de Recuperação',
            duration: '15-20 minutos',
            techniques: [
              'Contraste térmico (água quente/fria)',
              'Auto-massagem com foam roller',
              'Alongamentos suaves',
              'Compressão muscular',
              'Meditação e técnicas respiratórias'
            ],
            recommendations: [
              'Aplique gelo em áreas inflamadas por 15-20 minutos',
              'Use o foam roller por 30-60 segundos em cada grupo muscular',
              'Faça sessões de contraste: 2 min quente / 30s frio',
              'Pratique técnicas de respiração profunda'
            ],
            notes: [
              'Realize após treinos intensos',
              'Adapte as técnicas conforme sua resposta',
              'Mantenha boa hidratação durante o processo',
              'Monitore sinais de desconforto excessivo'
            ]
          }
        ],
        generalTips: [
          'Mantenha uma boa hidratação',
          'Garanta 7-8 horas de sono por noite',
          'Mantenha uma alimentação balanceada',
          'Monitore seus níveis de energia'
        ]
      });
    }
    if (gender === 'Female') {
      recommendations.push({
        title: '🔄 Recuperação e Regeneração',
        description: 'Estratégias para otimizar a recuperação muscular feminina',
        frequency: 'Conforme necessário',
        activities: [
          {
            type: 'Descanso Ativo',
            duration: '20-30 minutos',
            techniques: [
              'Caminhada leve ao ar livre',
              'Yoga restaurativa',
              'Hidroginástica leve',
              'Alongamentos suaves'
            ],
            recommendations: [
              'Escolha atividades de baixo impacto',
              'Mantenha-se hidratada durante as atividades',
              'Pratique em ambiente relaxante',
              'Respeite os sinais do seu corpo'
            ]
          },
          {
            type: 'Técnicas de Recuperação',
            duration: '15-20 minutos',
            techniques: [
              'Contraste térmico suave (água morna/fria)',
              'Automassagem com foam roller',
              'Técnicas de respiração profunda',
              'Meditação guiada',
              'Liberação miofascial',
              'Exercícios de mobilidade pélvica'
            ],
            recommendations: [
              'Aplique compressa morna em áreas tensas por 10-15 minutos',
              'Use o foam roller com pressão moderada',
              'Faça sessões de contraste: 2 min morno / 30s frio',
              'Pratique respiração diafragmática',
              'Dê atenção especial à região lombar e quadril'
            ],
            notes: [
              'Ajuste as técnicas durante o ciclo menstrual',
              'Evite pressão excessiva em períodos sensíveis',
              'Mantenha consistência nas práticas de recuperação',
              'Observe padrões de tensão corporal'
            ]
          },
          {
            type: 'Relaxamento e Bem-estar',
            duration: '20-30 minutos',
            techniques: [
              'Banho de imersão com sais',
              'Aromaterapia relaxante',
              'Alongamentos suaves',
              'Técnicas de mindfulness',
              'Exercícios de respiração calmante'
            ],
            recommendations: [
              'Crie um ambiente tranquilo e acolhedor',
              'Use óleos essenciais relaxantes (lavanda, camomila)',
              'Mantenha temperatura agradável durante as práticas',
              'Combine com música suave se desejar'
            ],
            benefits: [
              'Redução do estresse',
              'Melhora da qualidade do sono',
              'Equilíbrio hormonal',
              'Recuperação muscular otimizada',
              'Bem-estar emocional'
            ]
          }
        ],
        generalTips: [
          'Mantenha uma rotina regular de sono (7-8 horas)',
          'Hidrate-se adequadamente ao longo do dia',
          'Observe sinais de fadiga excessiva',
          'Adapte a intensidade conforme seu ciclo hormonal',
          'Priorize alimentação balanceada e nutritiva',
          'Inclua períodos de descanso entre treinos intensos'
        ],
        hormonalConsiderations: {
          title: 'Considerações Hormonais',
          recommendations: [
            'Ajuste a intensidade das técnicas de recuperação conforme a fase do ciclo',
            'Aumente o foco em relaxamento durante a fase pré-menstrual',
            'Priorize técnicas suaves durante o período menstrual',
            'Observe padrões de retenção de líquidos e adapte as práticas'
          ]
        },
        specialFocus: {
          title: 'Áreas de Atenção Especial',
          areas: [
            {
              region: 'Região Pélvica',
              techniques: [
                'Exercícios de mobilidade suave',
                'Alongamentos específicos',
                'Relaxamento do assoalho pélvico'
              ]
            },
            {
              region: 'Membros Inferiores',
              techniques: [
                'Drenagem linfática natural',
                'Elevação das pernas',
                'Massagem suave'
              ]
            },
            {
              region: 'Região Lombar',
              techniques: [
                'Alongamentos específicos',
                'Liberação miofascial suave',
                'Exercícios de estabilização'
              ]
            }
          ]
        }
      });
    }

    return recommendations;
  };

  const getNutritionalRecommendations = (userData, glycemia) => {
    const status = getGlycemiaStatus(glycemia);
    const weight = userData?.weight || 70;
    const imc = userData ? (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1) : 25;

    if (status === 'low') {
      return [{
        title: '🍯 Correção Imediata',
        portions: [
          `${Math.round(weight * 0.2)}g de carboidrato rápido`,
          '200ml de suco natural ou refrigerante comum',
          `${Math.round(weight * 0.3)}g de açúcar ou mel`
        ],
        timing: 'Agora',
        notes: 'Meça novamente em 15 minutos'
      },
      {
        title: '🥪 Após Normalização',
        portions: [
          '1 sanduíche integral com proteína',
          '1 fruta média',
          '1 copo de leite ou iogurte'
        ],
        timing: 'Após glicemia > 100mg/dL',
        notes: 'Previne nova queda'
      }];
    }

    if (status === 'high') {
      return [{
        title: '🥗 Refeição Corretiva',
        portions: [
          'Proteínas magras (100-150g)',
          'Vegetais não-amiláceos à vontade',
          'Evite totalmente carboidratos'
        ],
        timing: 'Próxima refeição',
        notes: 'Beba muita água'
      },
      {
        title: '⏰ Próximas 4 horas',
        portions: [
          'Apenas proteínas e gorduras boas',
          'Vegetais folhosos à vontade',
          'Água ou chás sem açúcar'
        ],
        timing: 'Até normalizar',
        notes: 'Monitore a cada 2 horas'
      }];
    }

    // Recomendações normais baseadas no perfil
    const carbsPerKg = imc > 25 ? 2 : 3;
    const proteinPerKg = imc > 25 ? 2 : 1.5;

    return [
      {
        title: '🍳 Café da Manhã',
        portions: [
          `${Math.round(weight * carbsPerKg * 0.2)}g de carboidratos complexos`,
          `${Math.round(weight * proteinPerKg * 0.25)}g de proteína`,
          'Gorduras boas (1 colher de azeite ou 1/4 abacate)'
        ],
        timing: '7h - 8h',
        notes: 'Inclua fibras e proteínas'
      },
      {
        title: '🥗 Almoço',
        portions: [
          `${Math.round(weight * carbsPerKg * 0.3)}g de carboidratos`,
          `${Math.round(weight * proteinPerKg * 0.3)}g de proteína`,
          'Vegetais à vontade',
          '1 colher de azeite'
        ],
        timing: '12h - 13h',
        notes: 'Priorize vegetais coloridos'
      },
      {
        title: '☕ Café da Tarde',
        portions: [
          `${Math.round(weight * carbsPerKg * 0.15)}g de carboidratos`,
          `${Math.round(weight * proteinPerKg * 0.15)}g de proteína`,
          '1 fruta média ou 1 fatia de pão integral',
          '1 porção de proteína magra (queijo branco, peito de peru)'
        ],
        timing: '15h - 16h',
        notes: 'Combine sempre carboidrato com proteína para maior saciedade'
      },
      {
        title: '🍽️ Jantar',
        portions: [
          `${Math.round(weight * carbsPerKg * 0.25)}g de carboidratos`,
          `${Math.round(weight * proteinPerKg * 0.3)}g de proteína`,
          'Vegetais à vontade',
          '1 colher de azeite'
        ],
        timing: '19h - 20h',
        notes: 'Evite carboidratos simples à noite. Prefira refeição mais leve que o almoço'
      }
    ];
  };

  const getMealSuggestions = (userData, glycemia) => {
    const status = getGlycemiaStatus(glycemia);
    const imc = userData ? (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1) : 25;
    const isOverweight = imc > 25;
    const diabetesType = userData?.diabetesType || 'type2';
    
    // Opções de café da manhã
    const breakfastOptions = [
      {
        title: "Omelete de Claras com Vegetais",
        link: "https://www.diabetes.org/healthy-living/recipes-nutrition/recipes/vegetable-omelet",
        calories: 250,
        carbs: 15,
        protein: 20,
        recommended: diabetesType === 'type1' || isOverweight,
        ingredients: [
          "3 claras de ovo",
          "Espinafre",
          "Cogumelos",
          "1 fatia de pão integral"
        ]
      },
      {
        title: "Overnight Oats com Frutas Vermelhas",
        link: "https://www.diabetesstrong.com/diabetic-overnight-oats/",
        calories: 300,
        carbs: 35,
        protein: 15,
        recommended: !isOverweight && status !== 'high',
        ingredients: [
          "40g de aveia",
          "200ml de leite desnatado",
          "Mix de frutas vermelhas",
          "Canela"
        ]
      },
      {
        title: "Panqueca Proteica de Banana",
        link: "https://www.diabetes.co.uk/recipes/protein-pancakes.html",
        calories: 280,
        carbs: 30,
        protein: 18,
        recommended: userData?.age < 50 && !isOverweight,
        ingredients: [
          "1 banana pequena",
          "2 ovos",
          "30g de whey protein",
          "Canela"
        ]
      }
    ];

    // Opções de almoço
    const lunchOptions = [
      {
        title: "Bowl de Quinoa com Frango",
        link: "https://www.diabetesstrong.com/quinoa-chicken-bowl/",
        calories: 400,
        carbs: 45,
        protein: 35,
        recommended: !isOverweight,
        ingredients: [
          "100g de frango grelhado",
          "50g de quinoa cozida",
          "Mix de vegetais assados",
          "Azeite de oliva"
        ]
      },
      {
        title: "Salmão com Legumes no Vapor",
        link: "https://www.diabetes.org/healthy-living/recipes-nutrition/recipes/salmon-vegetables",
        calories: 350,
        carbs: 20,
        protein: 30,
        recommended: status === 'high' || isOverweight,
        ingredients: [
          "150g de salmão",
          "Brócolis",
          "Cenoura",
          "Abobrinha"
        ]
      },
      {
        title: "Wrap de Peru com Homus",
        link: "https://www.diabetesstrong.com/low-carb-turkey-hummus-wrap/",
        calories: 380,
        carbs: 35,
        protein: 28,
        recommended: userData?.age < 40 && !isOverweight,
        ingredients: [
          "Tortilha integral",
          "100g de peru",
          "Homus",
          "Vegetais frescos"
        ]
      }
    ];

    // Opções de jantar
    const dinnerOptions = [
      {
        title: "Peixe Assado com Purê de Couve-Flor",
        link: "https://www.diabetes.org/healthy-living/recipes-nutrition/recipes/roasted-fish",
        calories: 300,
        carbs: 15,
        protein: 32,
        recommended: true, // Boa para todos
        ingredients: [
          "150g de peixe branco",
          "Couve-flor",
          "Alho",
          "Azeite de oliva"
        ]
      },
      {
        title: "Stir-Fry de Tofu e Vegetais",
        link: "https://www.diabetesstrong.com/tofu-stir-fry/",
        calories: 320,
        carbs: 25,
        protein: 20,
        recommended: isOverweight || status === 'high',
        ingredients: [
          "100g de tofu firme",
          "Mix de vegetais",
          "Molho shoyu light",
          "Gengibre"
        ]
      },
      {
        title: "Omelete de Forno com Ricota",
        link: "https://www.diabetes.co.uk/recipes/baked-omelette.html",
        calories: 280,
        carbs: 8,
        protein: 25,
        recommended: status === 'high' || isOverweight,
        ingredients: [
          "3 ovos",
          "50g de ricota",
          "Espinafre",
          "Tomate cereja"
        ]
      }
    ];

    return {
      breakfast: breakfastOptions.filter(option => option.recommended),
      lunch: lunchOptions.filter(option => option.recommended),
      dinner: dinnerOptions.filter(option => option.recommended)
    };
  };

  const renderContent = () => {
    if (activeTab === 'exercise') {
      return (
        <div className={styles.recommendationsContainer}>
          {recommendations.exercise.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={styles.exerciseCard}
            >
              <h3>{rec.title}</h3>
              <p>{rec.description}</p>
              <p><strong>Frequência:</strong> {rec.frequency}</p>

              {rec.warning && (
                <div className={styles.warningBox}>
                  <p>{rec.warning}</p>
                </div>
              )}

              {/* Opções de exercícios */}
              {rec.options && (
                <div className={styles.exerciseOptions}>
                  {rec.options.map((option, i) => (
                    <div key={i} className={styles.exerciseOption}>
                      <h4>{option.type}</h4>
                      <p>Duração: {option.duration}</p>
                      <p>Intensidade: {option.intensity}</p>
                      
                      {option.techniques && (
                        <div className={styles.techniquesList}>
                          <h4>Técnicas:</h4>
                          <ul>
                            {option.techniques.map((technique, idx) => (
                              <li key={idx}>{technique}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {option.recommendations && (
                        <div className={styles.recommendationsList}>
                          <h4>Recomendações:</h4>
                          <ul>
                            {option.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Detalhes dos exercícios */}
              {rec.exercises && (
                <div className={styles.exerciseDetails}>
                  {rec.exercises.map((ex, i) => (
                    <div key={i} className={styles.exerciseDetail}>
                      <h4>{ex.type}</h4>
                      <p>Séries: {ex.sets}</p>
                      <p>Repetições: {ex.reps}</p>
                      <p>Intensidade: {ex.intensity}</p>
                      <p>Descanso: {ex.rest}</p>
                      
                      {ex.techniques && (
                        <div className={styles.techniquesList}>
                          <h4>Técnicas:</h4>
                          <ul>
                            {ex.techniques.map((technique, idx) => (
                              <li key={idx}>{technique}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {ex.recommendations && (
                        <div className={styles.recommendationsList}>
                          <h4>Recomendações:</h4>
                          <ul>
                            {ex.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Atividades */}
              {rec.activities && (
                <div className={styles.activities}>
                  {rec.activities.map((activity, i) => (
                    <div key={i} className={styles.activity}>
                      <h4>{activity.type}</h4>
                      <p>Duração: {activity.duration}</p>
                      {activity.timing && <p>Momento: {activity.timing}</p>}
                      
                      {activity.techniques && (
                        <div className={styles.techniquesList}>
                          <h4>Técnicas:</h4>
                          <ul>
                            {activity.techniques.map((technique, idx) => (
                              <li key={idx}>{technique}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {activity.recommendations && (
                        <div className={styles.recommendationsList}>
                          <h4>Recomendações:</h4>
                          <ul>
                            {activity.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }
    if (activeTab === 'nutrition') {
        const meals = [
            {
                id: 'breakfast',
                title: 'Café da Manhã',
                icon: '🍳',
                portions: [
                    '49g de carboidratos complexos',
                    '62g de proteína',
                    'Gorduras boas (1 colher de azeite ou 1/4 abacate)'
                ],
                timing: '7h - 8h',
                notes: 'Inclua fibras e proteínas',
                suggestions: [
                    {
                        title: "Panqueca de Banana com Aveia",
                        ingredients: [
                            "1 banana madura",
                            "2 ovos",
                            "3 colheres de sopa de aveia",
                            "Canela a gosto"
                        ],
                        link: "https://www.receiteria.com.br/receita/panqueca-de-banana-fit/"
                    },
                    {
                        title: "Smoothie Verde Detox",
                        ingredients: [
                            "1 folha de couve",
                            "1 banana",
                            "1 punhado de espinafre",
                            "1/2 pepino",
                            "200 ml de água de coco",
                            "Gelo"
                        ],
                        link: "https://receitinhasleves.com.br/smoothie-verde-detox/"
                    },
                    {
                        title: "Crepioca Proteica",
                        ingredients: [
                            "1 ovo",
                            "1 colher de sopa de goma de tapioca",
                            "1 colher de requeijão light",
                            "Queijo cottage"
                        ],
                        link: "https://www.tudogostoso.com.br/receita/183595-crepioca-fit.html"
                    }
                ]
            },
            {
                id: 'lunch',
                title: 'Almoço',
                icon: '🍽️',
                portions: [
                    '74g de carboidratos',
                    '74g de proteína',
                    'Vegetais à vontade',
                    '1 colher de azeite'
                ],
                timing: '12h - 13h',
                notes: 'Priorize vegetais coloridos',
                suggestions: [
                    {
                        title: "Risoto de Quinoa com Frango",
                          ingredients: [
                            "5 coxas de frango",
                            "1 cebola em cubos",
                            "½ cenoura em cubos",
                            "2 talos de aipo fatiados",
                            "¼ de pimenta dedo-de-moça fatiado",
                            "Tomilho, louro, alecrim",
                            "2 colheres de açafrão da terra (cúrcuma)",
                            "1 colher de extrato de tomate",
                            "2 litros de água fervente",
                            "1 colher de alho picado",
                            "1 colher de gengibre ralado",
                            "Sal, pimenta e noz moscada a gosto"


                        ],
                        link: "https://receitas.globo.com/receitas-da-tv/que-marravilha/risoto-de-frango-quinoa-gorgonzola-e-brocolis-gnt.ghtml"
                    },
                    {
                        title: "Hambúrguer Caseiro com Salada",
                        ingredients: [
                            "400 g de carne moída",
                            "4 colheres (sopa) de Farelo de Aveia Orgânica",
                            "1 e meia colher (chá) de sal",
                            "meia cebola pequena ralada",
                            "1 xícara (chá) de abobrinha ralada no ralo fino"

                        ],
                        link: "https://www.receitasnestle.com.br/receitas/hamburguer-tradicional-saudavel"
                    },
                    {
                        title: "Legumes Assados com Peixe",
                        ingredients: [
                            "150 gramas de filé de peixe (optamos por tilápia)",
                            "Sal e pimenta a gosto",
                            "Suco de 1/2 limão",
                            "1 cebola em rodelas",
                            "1 pimentão",
                            "1 abobrinha pequena cortada em rodelas",
                            "1 tomate",
                            "Salsa e coentro a gosto"
                        ],
                        link: "https://www.receiteria.com.br/receita/peixe-assado-com-legumes/"
                    }
                ]
            },
            {
                id: 'afternoon',
                title: 'Café da Tarde',
                icon: '☕',
                portions: [
                    '37g de carboidratos',
                    '37g de proteína',
                    '1 fruta média ou 1 fatia de pão integral',
                    '1 porção de proteína magra'
                ],
                timing: '15h - 16h',
                notes: 'Combine sempre carboidrato com proteína para maior saciedade',
                suggestions: [
                    {
                        title: "Tapioca com Frango e Ricota",
                        ingredients: [
                            "500 g de massa de tapioca",
                            "200 g de creme de ricota fresca",
                            "10 g de chia",
                            "1 pote pequeno de tomate seco",
                            "300 g de frango desfiado"
                        ],
                        link: "https://receitas.globo.com/ana-maria-braga/salgados/tapioca-de-creme-de-ricota-chia-e-frango-desfiado.ghtml"
                    },
                    {
                        title: "Bolinho de Aveia com Banana – sem açúcar",
                        ingredients: [
                            "3 bananas grandes ou 4 médias",
                            "2 ovos",
                            "1 colher (chá) de canela em pó",
                            "1/2 xícara de uva passa",
                            "1 xícara – 115g – aveia flocos finos",
                            "1 colher (sp) fermento em pó"
                        ],
                        link: "https://blog.supernosso.com/pt-br/3-receitas-de-bolinho-de-banana-e-aveia-facil-e-delicioso/"
                    },
                    {
                        title: "Sanduíche Integral com Ovo",
                        ingredients: [
                            "4 folhas de escarola picadas",
                            "1 sachê de Tempero SAZÓN® para Pipoca sabor Cebola e Salsa",
                            "meia xícara (chá) de muçarela ralada",
                            "8 fatias de pão de forma integral",
                            "4 ovos",
                            "1 pitada de sal"
                        ],
                        link: "https://www.saboresajinomoto.com.br/receita/sanduiche-integral-com-ovo"
                    }
                ]
            },
            {
                id: 'dinner',
                title: 'Jantar',
                icon: '🌙',
                portions: [
                    '62g de carboidratos',
                    '74g de proteína',
                    'Vegetais à vontade',
                    '1 colher de azeite'
                ],
                timing: '19h - 20h',
                notes: 'Evite carboidratos simples à noite. Prefira refeição mais leve que o almoço',
                suggestions: [
                    {
                        title: "Caldo Verde Fit",
                        ingredients: [
                            "1 colher (sopa) de gordura da sua preferência (óleo de coco, manteiga ghee, banha)",
                            "350 gr de linguiça paio, cortada em cubos médios",
                            "1 cebola grande, em cubos médios",
                            "3 dentes de alho, picados finamente",
                            "1 talo de salsão, picado (opcional)",
                            "1 kg de chuchu, descascado e picado grosseiramente",
                            "1 litro de caldo de legumes (ou água)",
                            "200 gr de couve, picada finamente",
                            "sal, pimenta e noz moscada a gosto"
                        ],
                        link: "https://www.temperando.com/caldo-verde-low-carb/"
                    },
                    {
                        title: "Legumes Recheados com Carne",
                        ingredients: [
                            "Abobrinha",
                            "Berinjela",
                            "150g de carne moída",
                            "Queijo ralado light"
                        ],
                        link: "https://guiadacozinha.com.br/receitas/legumes-recheados-delicias-que-valem-por-uma-refeicao/"
                    },
                    {
                        title: "Frango ao Molho Mostarda",
                        ingredients: [
                            "500 a 600gr de peito de frango",
                            "4 dentes de alho",
                            "1 colher de chá de sal",
                            "pimenta do reino a gosto",
                            "3 fios de óleo",
                            "3 colheres de margarina ou manteiga ao todo",
                            "2 colheres de sopa de farinha de trigo (sem fermento)",
                            "meio litro de leite (500ml)",
                            "pimenta do reino a gosto",
                            "sal a gosto",
                            "3 colheres de sopa de mostarda",
                            "cebolinha a gosto"
                        ],
                        link: "https://blog.supernosso.com/pt-br/peito-de-frango-ao-molho-de-mostarda-economico-de-uma-panela-so-faca-no-dia-a-dia-receitasda-cris/"
                    }
                ]
            }
        ];
      return (
        <div className={styles.nutritionGrid}>
          {meals.map((meal) => (
            <MealCard key={meal.id} {...meal} />
          ))}
        </div>
      );
    }
  };

  const renderMealSuggestions = (mealTime) => {
    const suggestions = getMealSuggestions(userData, glycemiaData.lastMeasurement)[mealTime];
    
    return (
      <div className={styles.mealSuggestions}>
        <h4>Sugestões de Pratos:</h4>
        <div className={styles.suggestionCards}>
          {suggestions.map((meal, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={styles.suggestionCard}
            >
              <h5>{meal.title}</h5>
              <div className={styles.macros}>
                <span>🔥 {meal.calories} kcal</span>
                <span>🍚 {meal.carbs}g carbs</span>
                <span>🥩 {meal.protein}g prot</span>
              </div>
              <div className={styles.ingredients}>
                <h6>Ingredientes:</h6>
                <ul>
                  {meal.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              <a 
                href={meal.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.recipeLink}
              >
                Ver Receita Completa →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const MealCard = ({ title, icon, portions, timing, notes, suggestions }) => {
    const [openSuggestionId, setOpenSuggestionId] = useState(null);

    return (
      <div className={styles.mealCard}>
        <div className={styles.mealHeader}>
          <span className={styles.mealIcon}>{icon}</span>
          <h3>{title}</h3>
        </div>
        
        <div className={styles.mealContent}>
          <p><strong>Porções:</strong></p>
          {portions.map((portion, index) => (
            <p key={index}>{portion}</p>
          ))}
          <p><strong>Horário:</strong> {timing}</p>
          {notes && <p className={styles.notes}><strong>Obs:</strong> {notes}</p>}
        </div>

        <div className={styles.suggestionsList}>
          {suggestions.map((suggestion, index) => (
            <div key={index} className={styles.suggestionItem}>
              <button 
                className={styles.suggestionsButton}
                onClick={() => setOpenSuggestionId(openSuggestionId === index ? null : index)}
              >
                {openSuggestionId === index ? 'Ocultar Sugestão' : suggestion.title} 🍽️
              </button>

              <AnimatePresence>
                {openSuggestionId === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.suggestionContent}
                  >
                    <h4>{suggestion.title}</h4>
                    <div className={styles.ingredients}>
                      <p><strong>Ingredientes:</strong></p>
                      <ul>
                        {suggestion.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    <a 
                      href={suggestion.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.recipeLink}
                    >
                      Ver Receita Completa →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecoveryTechniques = (recovery) => {
    return (
      <div className={styles.recoveryCard}>
        {recovery.activities.map((activity, index) => (
          <div key={index} className={styles.techniqueSection}>
            <h3>{activity.type}</h3>
            
            {activity.duration && (
              <p className={styles.duration}>Duração: {activity.duration}</p>
            )}

            {activity.options && (
              <div className={styles.optionsList}>
                <h4>Opções:</h4>
                <ul>
                  {activity.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.techniques && (
              <div className={styles.techniquesList}>
                <h4>Técnicas:</h4>
                <ul>
                  {activity.techniques.map((technique, idx) => (
                    <li key={idx}>{technique}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.recommendations && (
              <div className={styles.recommendationsList}>
                <h4>Recomendações:</h4>
                <ul>
                  {activity.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.notes && (
              <div className={styles.notesList}>
                <h4>Observações:</h4>
                <ul>
                  {activity.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {recovery.generalTips && (
          <div className={styles.generalTips}>
            <h4>Dicas Gerais:</h4>
            <ul>
              {recovery.generalTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <motion.div className={styles.headerGlass}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <IoArrowBack size={24} />
        </button>
        <h1>Recomendações de Saúde</h1>
      </motion.div>

      {getGlycemiaStatus(glycemiaData.lastMeasurement) !== 'normal' && (
        <motion.div className={styles.alertWrapper}>
          {renderEmergencyAlert()}
        </motion.div>
      )}

      <div className={styles.statusCards}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.statusCard}
        >
          <div className={styles.statusIcon}>🎯</div>
          <div className={styles.statusInfo}>
            <h3>Meta Glicêmica</h3>
            <p>
              {glycemiaData.glycemiaGoals ? 
                `${glycemiaData.glycemiaGoals.targetMin}-${glycemiaData.glycemiaGoals.targetMax} mg/dL` : 
                'Carregando...'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.statusCard}
        >
          <div className={styles.statusIcon}>⚖️</div>
          <div className={styles.statusInfo}>
            <h3>IMC</h3>
            <p>
              {userData ? 
                `${(userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1)}` : 
                'Carregando...'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.statusCard}
        >
          <div className={styles.statusIcon}>📊</div>
          <div className={styles.statusInfo}>
            <h3>Última Medição</h3>
            <p>
              {glycemiaData.lastMeasurement ? 
                `${glycemiaData.lastMeasurement} mg/dL` : 
                'Sem medições'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'exercise' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('exercise')}
        >
          <span className={styles.tabIcon}>🏃‍♂️</span>
          Exercícios
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'nutrition' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <span className={styles.tabIcon}>🥗️</span>
          Alimentação
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={styles.contentContainer}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 