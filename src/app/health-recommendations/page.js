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
    exercise: null,
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

      // Buscar medições
      const measurementsResponse = await fetch('http://localhost:5000/api/measurements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!measurementsResponse.ok) throw new Error('Falha ao carregar medições');
      const measurements = await measurementsResponse.json();
      
      // Buscar perfil e metas do usuário
      const profileResponse = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) throw new Error('Falha ao carregar perfil');
      const profile = await profileResponse.json();

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

      // Atualizar recomendações baseadas nos dados
      const exerciseRecs = getExerciseRecommendations({
        ...profile,
        glycemiaGoals: goals,
        lastMeasurement: measurements[0]
      });

      const nutritionRecs = getNutritionalRecommendations({
        ...profile,
        glycemiaGoals: goals,
        lastMeasurement: measurements[0]
      });

      setRecommendations({
        exercise: exerciseRecs,
        nutrition: nutritionRecs
      });

      setUserData(profile);

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

    if (status === 'low') {
      return [{
        title: '⚠️ Exercícios Contraindicados',
        description: 'Não realize atividades físicas neste momento',
        instructions: [
          'Interrompa qualquer atividade física',
          'Sente-se ou deite-se para evitar quedas',
          'Aguarde a normalização da glicemia (> 100 mg/dL)',
          'Só retome após 30 minutos da correção'
        ]
      }];
    }

    if (status === 'high') {
      return [{
        title: '🚶‍♂️ Caminhada Leve',
        duration: '10-15 minutos',
        intensity: 'Muito leve',
        warning: 'Apenas após aplicação de insulina',
        notes: 'Mantenha-se hidratado'
      },
      {
        title: '🧘‍♂️ Exercícios Respiratórios',
        duration: '5-10 minutos',
        intensity: 'Leve',
        frequency: 'A cada 2 horas',
        notes: 'Ajuda a reduzir o estresse e a glicemia'
      }];
    }

    // Recomendações normais baseadas no perfil
    const recommendations = [];
    
    // Exercício Aeróbico Principal
    recommendations.push({
      title: '🏃‍♂️ Aeróbico Principal',
      type: age < 40 ? 'Corrida' : 'Caminhada',
      duration: age < 50 ? '45-60 minutos' : '30-45 minutos',
      intensity: age < 45 ? 'Moderada-Alta' : 'Moderada',
      frequency: '4-5x por semana',
      notes: imc > 30 ? 'Comece devagar e aumente gradualmente' : 'Mantenha ritmo constante'
    });

    // Exercício Complementar
    recommendations.push({
      title: '🏊‍♂️ Atividade Complementar',
      type: imc > 30 ? 'Natação ou Hidroginástica' : 'Ciclismo ou Dança',
      duration: '30-40 minutos',
      intensity: 'Moderada',
      frequency: '2-3x por semana',
      notes: 'Alterne com o exercício principal'
    });

    // Musculação/Força
    recommendations.push({
      title: '💪 Treino de Força',
      type: 'Musculação',
      duration: '40-50 minutos',
      intensity: age < 50 ? 'Moderada' : 'Leve a Moderada',
      frequency: '3x por semana',
      notes: 'Intercale com exercícios aeróbicos'
    });

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
                            "Sal, pimenta do moinho"


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
    if (activeTab === 'exercise') {
        return (
          <div className={styles.exerciseContainer}>
            <div className={styles.exerciseCard}>
              <h3>Exercícios Recomendados</h3>
              <div className={styles.exerciseList}>
                <div className={styles.exerciseItem}>
                  <h4>🏃‍♂️ Aeróbicos</h4>
                  <ul>
                    <li>Caminhada: 30 minutos, 3-4 vezes por semana</li>
                    <li>Natação: 30 minutos, 2-3 vezes por semana</li>
                    <li>Ciclismo: 20-30 minutos, 2-3 vezes por semana</li>
                  </ul>
                  <p className={styles.exerciseNote}>
                    Mantenha intensidade moderada, com frequência cardíaca entre 50-70% da máxima
                  </p>
                </div>
    
                <div className={styles.exerciseItem}>
                  <h4>💪 Musculação</h4>
                  <ul>
                    <li>2-3 vezes por semana</li>
                    <li>8-12 repetições por exercício</li>
                    <li>2-3 séries por exercício</li>
                    <li>Intervalo: 60-90 segundos entre séries</li>
                  </ul>
                  <p className={styles.exerciseNote}>
                    Alterne entre membros superiores e inferiores
                  </p>
                </div>
    
                <div className={styles.exerciseItem}>
                  <h4>⚠️ Recomendações Gerais</h4>
                  <ul>
                    <li>Monitore a glicemia antes e depois dos exercícios</li>
                    <li>Tenha sempre um carboidrato rápido disponível</li>
                    <li>Hidrate-se adequadamente</li>
                    <li>Use roupas e calçados apropriados</li>
                  </ul>
                </div>
    
                <div className={styles.exerciseItem}>
                  <h4>🎯 Cuidados Importantes</h4>
                  <ul>
                    <li>Evite exercícios em jejum</li>
                    <li>Pare imediatamente se sentir tontura ou mal-estar</li>
                    <li>Prefira exercitar-se acompanhado</li>
                    <li>Mantenha um registro das atividades e resposta glicêmica</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      }
    // ... resto do código para a aba de exercícios
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