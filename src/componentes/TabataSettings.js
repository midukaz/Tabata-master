import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTabata } from '../context/TabataContext';

const TabataSettings = () => {
  const { 
    preparationTime, 
    exerciseTime, 
    restTime, 
    cycles,
    sets,
    updateSettings,
    timerState,
    TIMER_STATES
  } = useTabata();

  const [modalVisible, setModalVisible] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    preparation: preparationTime.toString(),
    exercise: exerciseTime.toString(),
    rest: restTime.toString(),
    cyclesCount: cycles.toString(),
    setsCount: sets.toString(),
  });

  const handleSave = () => {
    updateSettings({
      preparation: parseInt(tempSettings.preparation) || 10,
      exercise: parseInt(tempSettings.exercise) || 20,
      rest: parseInt(tempSettings.rest) || 10,
      cyclesCount: parseInt(tempSettings.cyclesCount) || 8,
      setsCount: parseInt(tempSettings.setsCount) || 1,
    });
    setModalVisible(false);
  };

  // Desabilitar botão de configurações quando o temporizador estiver em execução
  const isDisabled = timerState !== TIMER_STATES.IDLE && timerState !== TIMER_STATES.COMPLETED;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.settingsButton, isDisabled && styles.disabledButton]} 
        onPress={() => setModalVisible(true)}
        disabled={isDisabled}
      >
        <Entypo name="cog" size={24} color="white" />
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configurações do Tabata</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Preparação (seg)</Text>
              <TextInput
                style={styles.input}
                value={tempSettings.preparation}
                onChangeText={(text) => setTempSettings({...tempSettings, preparation: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Exercício (seg)</Text>
              <TextInput
                style={styles.input}
                value={tempSettings.exercise}
                onChangeText={(text) => setTempSettings({...tempSettings, exercise: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Descanso (seg)</Text>
              <TextInput
                style={styles.input}
                value={tempSettings.rest}
                onChangeText={(text) => setTempSettings({...tempSettings, rest: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de Ciclos</Text>
              <TextInput
                style={styles.input}
                value={tempSettings.cyclesCount}
                onChangeText={(text) => setTempSettings({...tempSettings, cyclesCount: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de Conjuntos</Text>
              <TextInput
                style={styles.input}
                value={tempSettings.setsCount}
                onChangeText={(text) => setTempSettings({...tempSettings, setsCount: text})}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.settingsSummary}>
        <Text style={styles.summaryText}>Preparação: {preparationTime}s</Text>
        <Text style={styles.summaryText}>Exercício: {exerciseTime}s</Text>
        <Text style={styles.summaryText}>Descanso: {restTime}s</Text>
        <Text style={styles.summaryText}>Ciclos: {cycles}</Text>
        <Text style={styles.summaryText}>Conjuntos: {sets}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  settingsButton: {
    backgroundColor: '#444444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#333333',
    width: '85%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#444444',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#b22222',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#00dd99',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  settingsSummary: {
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  summaryText: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
});

export default TabataSettings; 