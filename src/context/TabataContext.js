import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estados do temporizador
const TIMER_STATES = {
  IDLE: 'idle',
  PREPARATION: 'preparation',
  EXERCISE: 'exercise',
  REST: 'rest',
  COMPLETED: 'completed',
};

// Configurações padrão
const DEFAULT_SETTINGS = {
  preparationTime: 10,
  exerciseTime: 20,
  restTime: 10,
  cycles: 8,
  sets: 1,
};

// Chave para armazenar configurações personalizadas
const EXERCISE_SETTINGS_KEY = '@tabata_exercise_settings';

// Contexto do Tabata
const TabataContext = createContext({});

// Provedor do contexto
export const TabataProvider = ({ children }) => {
  // Configurações padrão do Tabata
  const [preparationTime, setPreparationTime] = useState(DEFAULT_SETTINGS.preparationTime);
  const [exerciseTime, setExerciseTime] = useState(DEFAULT_SETTINGS.exerciseTime);
  const [restTime, setRestTime] = useState(DEFAULT_SETTINGS.restTime);
  const [cycles, setCycles] = useState(DEFAULT_SETTINGS.cycles);
  const [sets, setSets] = useState(DEFAULT_SETTINGS.sets);

  // Configurações personalizadas por exercício
  const [exerciseSettings, setExerciseSettings] = useState({});

  // Estado do temporizador
  const [timerState, setTimerState] = useState(TIMER_STATES.IDLE);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  
  // Exercício selecionado
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Referência de temporizador
  let timer = null;

  // Carregar configurações personalizadas dos exercícios
  useEffect(() => {
    const loadExerciseSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(EXERCISE_SETTINGS_KEY);
        if (storedSettings) {
          setExerciseSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Erro ao carregar configurações personalizadas:', error);
      }
    };

    loadExerciseSettings();
  }, []);

  // Salvar configurações personalizadas dos exercícios
  const saveExerciseSettings = async (settings) => {
    try {
      await AsyncStorage.setItem(EXERCISE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações personalizadas:', error);
    }
  };

  // Efeito para o temporizador
  useEffect(() => {
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            moveToNextState();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, timerState]);

  // Obter configurações específicas para o exercício atual
  const getCurrentSettings = () => {
    if (selectedExercise && exerciseSettings[selectedExercise.id]) {
      return exerciseSettings[selectedExercise.id];
    }
    return {
      preparationTime,
      exerciseTime,
      restTime,
      cycles,
      sets
    };
  };

  // Função para iniciar o temporizador
  const startTimer = () => {
    const settings = getCurrentSettings();
    setTimerState(TIMER_STATES.PREPARATION);
    setCurrentTime(settings.preparationTime);
    setCurrentCycle(1);
    setCurrentSet(1);
    setIsRunning(true);
  };

  // Função para iniciar um exercício específico
  const startExerciseFromList = (exercise) => {
    setSelectedExercise(exercise);
    // Usar um setTimeout para garantir que selectedExercise seja atualizado antes de startTimer
    setTimeout(() => {
      startTimer();
    }, 100);
  };

  // Função para pausar o temporizador
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Função para retomar o temporizador
  const resumeTimer = () => {
    setIsRunning(true);
  };

  // Função para reiniciar o temporizador
  const resetTimer = () => {
    clearInterval(timer);
    setTimerState(TIMER_STATES.IDLE);
    setCurrentTime(0);
    setIsRunning(false);
    setCurrentCycle(1);
    setCurrentSet(1);
    setSelectedExercise(null);
  };

  // Função para mover para o próximo estado
  const moveToNextState = () => {
    const settings = getCurrentSettings();
    
    switch (timerState) {
      case TIMER_STATES.PREPARATION:
        setTimerState(TIMER_STATES.EXERCISE);
        setCurrentTime(settings.exerciseTime);
        setIsRunning(true);
        break;
      case TIMER_STATES.EXERCISE:
        if (currentCycle < settings.cycles) {
          setTimerState(TIMER_STATES.REST);
          setCurrentTime(settings.restTime);
          setIsRunning(true);
        } else {
          if (currentSet < settings.sets) {
            setCurrentSet(prevSet => prevSet + 1);
            setCurrentCycle(1);
            setTimerState(TIMER_STATES.REST);
            setCurrentTime(settings.restTime);
            setIsRunning(true);
          } else {
            setTimerState(TIMER_STATES.COMPLETED);
            setIsRunning(false);
            Alert.alert('Treino Completo!', 'Parabéns! Você concluiu seu treino Tabata.');
          }
        }
        break;
      case TIMER_STATES.REST:
        setTimerState(TIMER_STATES.EXERCISE);
        setCurrentTime(settings.exerciseTime);
        setCurrentCycle(prevCycle => prevCycle + 1);
        setIsRunning(true);
        break;
      default:
        break;
    }
  };

  // Função para atualizar as configurações globais
  const updateSettings = (settings) => {
    if (settings.preparation) setPreparationTime(parseInt(settings.preparation));
    if (settings.exercise) setExerciseTime(parseInt(settings.exercise));
    if (settings.rest) setRestTime(parseInt(settings.rest));
    if (settings.cycles) setCycles(parseInt(settings.cycles));
    if (settings.sets) setSets(parseInt(settings.sets));
  };

  // Função para atualizar configurações de um exercício específico
  const updateExerciseSettings = (exerciseId, settings) => {
    const updatedSettings = {
      ...exerciseSettings,
      [exerciseId]: {
        preparationTime: parseInt(settings.preparation) || DEFAULT_SETTINGS.preparationTime,
        exerciseTime: parseInt(settings.exercise) || DEFAULT_SETTINGS.exerciseTime,
        restTime: parseInt(settings.rest) || DEFAULT_SETTINGS.restTime,
        cycles: parseInt(settings.cycles) || DEFAULT_SETTINGS.cycles,
        sets: parseInt(settings.sets) || DEFAULT_SETTINGS.sets,
      }
    };
    
    setExerciseSettings(updatedSettings);
    saveExerciseSettings(updatedSettings);
    
    // Se for o exercício atualmente selecionado, atualiza o timer
    if (selectedExercise && selectedExercise.id === exerciseId && timerState === TIMER_STATES.IDLE) {
      const newSettings = updatedSettings[exerciseId];
      setCurrentTime(0);
    }
    
    return true;
  };

  // Função para remover configurações personalizadas de um exercício
  const resetExerciseSettings = (exerciseId) => {
    const updatedSettings = { ...exerciseSettings };
    delete updatedSettings[exerciseId];
    
    setExerciseSettings(updatedSettings);
    saveExerciseSettings(updatedSettings);
    
    return true;
  };

  // Função para verificar se um exercício tem configurações personalizadas
  const hasCustomSettings = (exerciseId) => {
    return !!exerciseSettings[exerciseId];
  };

  // Função para obter configurações de um exercício específico
  const getExerciseSettings = (exerciseId) => {
    return exerciseSettings[exerciseId] || {
      preparationTime,
      exerciseTime,
      restTime,
      cycles,
      sets
    };
  };

  // Função para reproduzir som - comentada para evitar erros
  const playSound = async () => {
    // Comentamos temporariamente para evitar erros
    // try {
    //   const { sound } = await Audio.Sound.createAsync(
    //     require('../assets/beep.mp3')
    //   );
    //   await sound.playAsync();
    // } catch (error) {
    //   console.log('Erro ao reproduzir som:', error);
    // }
    console.log('Som simulado');
  };

  return (
    <TabataContext.Provider
      value={{
        preparationTime,
        exerciseTime,
        restTime,
        cycles,
        sets,
        timerState,
        currentTime,
        isRunning,
        currentCycle,
        currentSet,
        selectedExercise,
        TIMER_STATES,
        DEFAULT_SETTINGS,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        updateSettings,
        startExerciseFromList,
        setSelectedExercise,
        updateExerciseSettings,
        resetExerciseSettings,
        hasCustomSettings,
        getExerciseSettings
      }}
    >
      {children}
    </TabataContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useTabata = () => {
  const context = useContext(TabataContext);
  if (!context) {
    throw new Error('useTabata deve ser usado dentro de um TabataProvider');
  }
  return context;
}; 