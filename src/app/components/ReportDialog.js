import { useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import Chart from 'chart.js/auto';
import styles from './ReportDialog.module.css';

export default function ReportDialog({ onClose }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateStats = (measurements) => {
    if (!measurements || measurements.length === 0) {
      return {
        media: 0,
        desvioPadrao: 0,
        hba1cEstimada: 0,
        hyper: 0,
        normal: 0,
        hypo: 0
      };
    }

    // Cálculo da média
    const values = measurements.map(m => m.glycemiaValue);
    const media = values.reduce((a, b) => a + b, 0) / values.length;

    // Cálculo do desvio padrão
    const desvioPadrao = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - media, 2), 0) / values.length
    );

    // Cálculo da HbA1c estimada
    const hba1cEstimada = (media + 46.7) / 28.7;

    // Cálculo das distribuições
    const total = measurements.length;
    const stats = measurements.reduce((acc, measurement) => {
      const value = measurement.glycemiaValue;
      if (value >= 180) acc.hyper++;
      else if (value >= 70 && value <= 179) acc.normal++;
      else if (value < 70) acc.hypo++;
      return acc;
    }, { hyper: 0, normal: 0, hypo: 0 });

    return {
      media: media.toFixed(1),
      desvioPadrao: desvioPadrao.toFixed(1),
      hba1cEstimada: hba1cEstimada.toFixed(1),
      hyper: ((stats.hyper / total) * 100).toFixed(1),
      normal: ((stats.normal / total) * 100).toFixed(1),
      hypo: ((stats.hypo / total) * 100).toFixed(1)
    };
  };

  const createExcelWithCharts = async (data) => {
    const stats = calculateStats(data.medicoes);
    
    const wb = XLSX.utils.book_new();
    
    // Estilos comuns
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4361EE" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };

    const titleStyle = {
      font: { bold: true, sz: 16, color: { rgb: "000000" } },
      alignment: { horizontal: "left" },
      fill: { fgColor: { rgb: "E8EAED" } }
    };

    const subtitleStyle = {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: "left" },
      fill: { fgColor: { rgb: "F8F9FA" } }
    };

    const cellStyle = {
      alignment: { horizontal: "left", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "E0E0E0" } },
        bottom: { style: "thin", color: { rgb: "E0E0E0" } },
        left: { style: "thin", color: { rgb: "E0E0E0" } },
        right: { style: "thin", color: { rgb: "E0E0E0" } }
      }
    };

    // Aba 1: Visão Geral com Formatação
    const overviewData = [
      [{ v: 'Relatório de Monitoramento Glicêmico', s: titleStyle }],
      [{ v: `Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`, s: subtitleStyle }],
      [''],
      [{ v: 'Resumo das Medições', s: subtitleStyle }],
      [
        { v: 'Média Glicêmica:', s: cellStyle },
        { v: stats.media, s: { ...cellStyle, alignment: { horizontal: "right" } } },
        { v: 'mg/dL', s: cellStyle }
      ],
      [
        { v: 'HbA1c Estimada:', s: cellStyle },
        { v: stats.hba1cEstimada, s: { ...cellStyle, alignment: { horizontal: "right" } } },
        { v: '%', s: cellStyle }
      ],
      [
        { v: 'Desvio Padrão:', s: cellStyle },
        { v: stats.desvioPadrao, s: { ...cellStyle, alignment: { horizontal: "right" } } },
        { v: '', s: cellStyle }
      ],
      [''],
      [{ v: 'Distribuição das Medições', s: subtitleStyle }],
      [
        { v: 'Hipoglicemia (<70 mg/dL):', s: cellStyle },
        { v: stats.hypo, s: { ...cellStyle, alignment: { horizontal: "right" } } },
        { v: '%', s: cellStyle }
      ],
      [
        { v: 'Faixa Alvo (70-180 mg/dL):', s: cellStyle },
        { v: stats.normal, s: { ...cellStyle, alignment: { horizontal: "right" } } },
        { v: '%', s: cellStyle }
      ],
      [
        { v: 'Hiperglicemia (>180 mg/dL):', s: cellStyle },
        { v: stats.hyper, s: { ...cellStyle, alignment: { horizontal: "right" } } },
        { v: '%', s: cellStyle }
      ]
    ];

    const ws_overview = XLSX.utils.aoa_to_sheet(overviewData);
    
    // Definir larguras das colunas
    ws_overview['!cols'] = [
      { width: 30 }, // Coluna A
      { width: 15 }, // Coluna B
      { width: 10 }, // Coluna C
    ];

    // Definir altura das linhas
    ws_overview['!rows'] = Array(overviewData.length).fill({ hpt: 25 }); // 25 points height

    XLSX.utils.book_append_sheet(wb, ws_overview, 'Visão Geral');

    // Aba 2: Medições Detalhadas com Formatação
    const headers = [
      'Data',
      'Hora',
      'Glicemia (mg/dL)',
      'Tipo de Refeição',
      'Momento',
      'Classificação',
      'Observações'
    ];

    const measurements = [
      headers.map(h => ({ v: h, s: headerStyle })),
      ...data.medicoes.map(m => ([
        { v: new Date(m.recordedAt).toLocaleDateString('pt-BR'), s: cellStyle },
        { v: new Date(m.recordedAt).toLocaleTimeString('pt-BR'), s: cellStyle },
        { v: m.glycemiaValue, s: {
          ...cellStyle,
          font: { color: { rgb: getGlycemiaColor(m.glycemiaValue) } }
        }},
        { v: m.mealType || '-', s: cellStyle },
        { v: m.measurementTime || '-', s: cellStyle },
        { v: getGlycemiaClass(m.glycemiaValue), s: cellStyle },
        { v: m.notes || '-', s: cellStyle }
      ]))
    ];

    const ws_measurements = XLSX.utils.aoa_to_sheet(measurements);
    
    // Definir larguras das colunas para medições
    ws_measurements['!cols'] = [
      { width: 12 }, // Data
      { width: 10 }, // Hora
      { width: 15 }, // Glicemia
      { width: 20 }, // Tipo Refeição
      { width: 15 }, // Momento
      { width: 15 }, // Classificação
      { width: 30 }  // Observações
    ];

    XLSX.utils.book_append_sheet(wb, ws_measurements, 'Medições');

    // Criar e adicionar gráfico
    const chartCanvas = await createChart(stats);
    const ws_charts = XLSX.utils.aoa_to_sheet([
      [{ v: 'Distribuição Glicêmica', s: titleStyle }],
      [''],
      [{ v: chartCanvas.toDataURL(), t: 'i' }]
    ]);

    XLSX.utils.book_append_sheet(wb, ws_charts, 'Gráficos');

    // Salvar arquivo
    XLSX.writeFile(wb, `Relatorio_Glicemico_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`);
  };

  const createChart = async (stats) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    
    new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Hiperglicemia', 'Faixa Alvo', 'Hipoglicemia'],
        datasets: [{
          data: [
            Number(stats.hyper),
            Number(stats.normal),
            Number(stats.hypo)
          ],
          backgroundColor: ['#FF8B9A', '#54DCC3', '#FFD66B'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Distribuição Glicêmica'
          }
        }
      }
    });

    return canvas;
  };

  const getGlycemiaColor = (value) => {
    if (value < 70) return "FF9800"; // Laranja para hipo
    if (value > 180) return "F44336"; // Vermelho para hiper
    return "4CAF50"; // Verde para alvo
  };

  const getGlycemiaClass = (value) => {
    if (value < 70) return "Hipoglicemia";
    if (value > 180) return "Hiperglicemia";
    return "Faixa Alvo";
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Ajustar as datas para incluir o dia inteiro
      const startDateTime = new Date(startDate);
      startDateTime.setUTCHours(0, 0, 0, 0);

      const endDateTime = new Date(endDate);
      endDateTime.setUTCHours(23, 59, 59, 999);

      // Ajustar o fuso horário para considerar horário local
      const startDateISO = new Date(startDateTime.getTime() - (startDateTime.getTimezoneOffset() * 60000)).toISOString();
      const endDateISO = new Date(endDateTime.getTime() - (endDateTime.getTimezoneOffset() * 60000)).toISOString();

      const response = await fetch(
        `https://glico-flow-api.onrender.com/api/reports?startDate=${startDateISO}&endDate=${endDateISO}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Falha ao gerar relatório');

      const data = await response.json();
      
      // Verificar se há medições no período
      if (!data.medicoes || data.medicoes.length === 0) {
        setError('Nenhuma medição encontrada para o período selecionado');
        return;
      }

      await createExcelWithCharts(data);
      onClose();
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <h2>Exportar Relatório Excel</h2>
        
        <div className={styles.content}>
          <div className={styles.dateInputs}>
            <div className={styles.inputGroup}>
              <label>Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.exportButton}
            onClick={handleExport} 
            disabled={loading || !startDate || !endDate}
          >
            {loading ? 'Gerando relatório...' : 'Exportar Relatório'}
          </button>
          <button 
            className={styles.cancelButton}
            onClick={onClose} 
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}