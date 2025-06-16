import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/weather'; // URL DE CONEXÃO A API

function useWeatherHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    console.log('Buscando nova atualização');
    try {
      const res = await axios.get(API_BASE_URL);
      if (res.data && Array.isArray(res.data)) {
        setHistory(currentHistory => {
          const newHistory = res.data.slice(-100);
          // Comparação de Históricos (Atual != Novo Então Atualizar)
          if (JSON.stringify(currentHistory) !== JSON.stringify(newHistory)) {
            console.log('Dados atualizados:', newHistory.length, 'registros');
            return newHistory;
          }
          return currentHistory;
        });
        setError(null);
      }
    } catch (err) {
      console.error('Erro na API:', err);
      setError('Não foi possível conectar à API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Primeira busca
    fetchData();

    // Configura o intervalo
    intervalRef.current = setInterval(() => {
      console.log('Executando atualização automática...');
      fetchData();
    }, 60000); // 1 minuto

    // Função de Limpeza
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // Array de dependências vazio - só executa uma vez

  // Função para forçar atualização manual (opcional)
  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

  return { 
    history, 
    loading, 
    error, 
    refreshData // Opcional: permite atualização manual
  };
}

export default useWeatherHistory;