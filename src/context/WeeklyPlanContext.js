import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dias da semana
const WEEKDAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];

// Chave para armazenamento local
const STORAGE_KEY = '@tabata_weekly_plan';

// Contexto de planejamento semanal
const WeeklyPlanContext = createContext({});

// Provedor do contexto
export const WeeklyPlanProvider = ({ children }) => {
  // Estado para armazenar o plano semanal
  // Formato: { Segunda: [exercícios], Terça: [exercícios], ... }
  const [weeklyPlan, setWeeklyPlan] = useState(() => {
    const initialPlan = {};
    WEEKDAYS.forEach(day => {
      initialPlan[day] = [];
    });
    return initialPlan;
  });

  // Função para atualizar o plano de forma segura
  const updatePlan = useCallback((newPlan) => {
    console.log("Atualizando plano:", newPlan);
    setWeeklyPlan(newPlan);
    saveWeeklyPlan(newPlan);
  }, []);

  // Carrega o plano semanal do AsyncStorage
  useEffect(() => {
    const loadWeeklyPlan = async () => {
      try {
        const storedPlan = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedPlan) {
          setWeeklyPlan(JSON.parse(storedPlan));
        }
      } catch (error) {
        console.error('Erro ao carregar plano semanal:', error);
      }
    };

    loadWeeklyPlan();
  }, []);

  // Salva o plano semanal no AsyncStorage
  const saveWeeklyPlan = async (plan) => {
    try {
      console.log("Salvando plano:", plan);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (error) {
      console.error('Erro ao salvar plano semanal:', error);
    }
  };

  // Adiciona um exercício a um dia da semana
  const addExerciseToDay = (exercise, day) => {
    const updatedPlan = JSON.parse(JSON.stringify(weeklyPlan));
    
    // Verifica se o exercício já existe no dia
    const exerciseExists = updatedPlan[day].some(item => item.id === exercise.id);
    
    if (!exerciseExists) {
      updatedPlan[day] = [...updatedPlan[day], exercise];
      updatePlan(updatedPlan);
      Alert.alert('Sucesso', `${exercise.name} adicionado a ${day}`);
    } else {
      Alert.alert('Aviso', `${exercise.name} já está programado para ${day}`);
    }
  };

  // Remove um exercício de um dia da semana
  const removeExerciseFromDay = (exerciseId, day) => {
    console.log(`WeeklyPlanContext: Removendo exercício ID ${exerciseId} do dia ${day}`);
    
    // Verificar se o dia existe no plano
    if (!weeklyPlan[day]) {
      console.error(`Dia ${day} não encontrado no plano`);
      return false;
    }
    
    // Verificar se o exercício existe no dia antes de tentar remover
    const exerciseToRemove = weeklyPlan[day].find(ex => ex.id === exerciseId);
    if (!exerciseToRemove) {
      console.error(`Exercício ID ${exerciseId} não encontrado no dia ${day}`);
      return false;
    }
    
    // Criar uma cópia profunda do plano atual
    const updatedPlan = JSON.parse(JSON.stringify(weeklyPlan));
    
    // Filtrar o exercício específico
    updatedPlan[day] = updatedPlan[day].filter(exercise => exercise.id !== exerciseId);
    
    console.log(`Após remoção: ${updatedPlan[day].length} exercícios no dia ${day}`);
    
    // Atualizar o estado e salvar
    updatePlan(updatedPlan);
    
    return true;
  };

  // Limpa todos os exercícios de um dia
  const clearDay = (day) => {
    const updatedPlan = JSON.parse(JSON.stringify(weeklyPlan));
    updatedPlan[day] = [];
    updatePlan(updatedPlan);
  };

  // Limpa todo o plano semanal
  const clearWeeklyPlan = () => {
    const emptyPlan = {};
    WEEKDAYS.forEach(day => {
      emptyPlan[day] = [];
    });
    updatePlan(emptyPlan);
  };

  // Obtém um exercício do dia
  const getExercisesForDay = (day) => {
    return weeklyPlan[day] || [];
  };

  return (
    <WeeklyPlanContext.Provider
      value={{
        weeklyPlan,
        addExerciseToDay,
        removeExerciseFromDay,
        clearDay,
        clearWeeklyPlan,
        getExercisesForDay,
        WEEKDAYS
      }}
    >
      {children}
    </WeeklyPlanContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useWeeklyPlan = () => {
  const context = useContext(WeeklyPlanContext);
  if (!context) {
    throw new Error('useWeeklyPlan deve ser usado dentro de um WeeklyPlanProvider');
  }
  return context;
}; 