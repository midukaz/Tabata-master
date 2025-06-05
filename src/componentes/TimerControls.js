import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTabata } from '../context/TabataContext';

const TimerControls = () => {
  const { 
    isRunning, 
    timerState, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    resetTimer, 
    TIMER_STATES 
  } = useTabata();

  return (
    <View style={styles.container}>
      {/* Botão Iniciar/Pausar/Retomar */}
      {timerState === TIMER_STATES.IDLE ? (
        <TouchableOpacity style={styles.buttonStart} onPress={startTimer}>
          <Entypo name="controller-play" size={24} color="white" />
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
      ) : isRunning ? (
        <TouchableOpacity style={styles.buttonPause} onPress={pauseTimer}>
          <Entypo name="controller-paus" size={24} color="white" />
          <Text style={styles.buttonText}>Pausar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.buttonResume} onPress={resumeTimer}>
          <Entypo name="controller-play" size={24} color="white" />
          <Text style={styles.buttonText}>Retomar</Text>
        </TouchableOpacity>
      )}

      {/* Botão Reiniciar */}
      {timerState !== TIMER_STATES.IDLE && (
        <TouchableOpacity style={styles.buttonReset} onPress={resetTimer}>
          <Entypo name="ccw" size={24} color="white" />
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonStart: {
    backgroundColor: '#ff8c00', // laranja
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: '#b8860b',
  },
  buttonPause: {
    backgroundColor: '#b22222', // vermelho
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: '#e9967a',
  },
  buttonResume: {
    backgroundColor: '#00dd99', // verde
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: 'green',
  },
  buttonReset: {
    backgroundColor: '#333333', // cinza escuro
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: '#666666',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default TimerControls; 