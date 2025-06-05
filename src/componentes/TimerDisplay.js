import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTabata } from '../context/TabataContext';

const TimerDisplay = () => {
  const { 
    currentTime, 
    timerState, 
    currentCycle, 
    cycles, 
    selectedExercise,
    TIMER_STATES 
  } = useTabata();

  // Formatar o tempo para exibição (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Determinar a cor baseada no estado atual
  const getStateColor = () => {
    switch (timerState) {
      case TIMER_STATES.PREPARATION:
        return '#7fff00'; // Verde claro para preparação
      case TIMER_STATES.EXERCISE:
        return '#00dd99'; // Verde para exercício
      case TIMER_STATES.REST:
        return '#ff4500'; // Laranja avermelhado para descanso
      case TIMER_STATES.COMPLETED:
        return '#4169e1'; // Azul royal para completado
      default:
        return '#ffffff'; // Branco para estado ocioso
    }
  };

  // Obter texto do estado atual
  const getStateText = () => {
    switch (timerState) {
      case TIMER_STATES.PREPARATION:
        return 'PREPARAÇÃO';
      case TIMER_STATES.EXERCISE:
        return 'EXERCÍCIO';
      case TIMER_STATES.REST:
        return 'DESCANSO';
      case TIMER_STATES.COMPLETED:
        return 'CONCLUÍDO';
      default:
        return 'PRONTO?';
    }
  };

  return (
    <View style={styles.container}>
      {/* Mostrar nome do exercício se selecionado */}
      {selectedExercise && (
        <Text style={styles.exerciseName}>{selectedExercise.name}</Text>
      )}
      
      <View style={[styles.timerCircle, { borderColor: getStateColor() }]}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={[styles.stateText, { color: getStateColor() }]}>{getStateText()}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={styles.cycleText}>
          Ciclo {timerState !== TIMER_STATES.IDLE ? currentCycle : '-'} / {cycles}
        </Text>
        <View style={styles.progressBar}>
          {Array.from({ length: cycles }).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressSegment, 
                index < currentCycle && timerState !== TIMER_STATES.IDLE 
                  ? { backgroundColor: getStateColor() } 
                  : { backgroundColor: '#333' }
              ]} 
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  stateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  cycleText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  progressSegment: {
    width: 20,
    height: 6,
    marginHorizontal: 2,
    borderRadius: 3,
  },
});

export default TimerDisplay; 