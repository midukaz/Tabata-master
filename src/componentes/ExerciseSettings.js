import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { useTabata } from '../context/TabataContext';
import { MaterialIcons, Entypo } from '@expo/vector-icons';

const ExerciseSettings = ({ exercise, visible, onClose }) => {
  const { 
    DEFAULT_SETTINGS, 
    updateExerciseSettings, 
    resetExerciseSettings, 
    getExerciseSettings,
    hasCustomSettings
  } = useTabata();

  const [tempSettings, setTempSettings] = useState({
    preparation: '',
    exercise: '',
    rest: '',
    cycles: '',
    sets: '',
  });

  const [hasCustom, setHasCustom] = useState(false);

  // Carregar configurações existentes ao abrir o modal
  useEffect(() => {
    if (visible && exercise) {
      const currentSettings = getExerciseSettings(exercise.id);
      setHasCustom(hasCustomSettings(exercise.id));
      
      setTempSettings({
        preparation: currentSettings.preparationTime.toString(),
        exercise: currentSettings.exerciseTime.toString(),
        rest: currentSettings.restTime.toString(),
        cycles: currentSettings.cycles.toString(),
        sets: currentSettings.sets.toString(),
      });
    }
  }, [visible, exercise, getExerciseSettings, hasCustomSettings]);

  // Salvar configurações personalizadas
  const handleSave = () => {
    updateExerciseSettings(exercise.id, tempSettings);
    Alert.alert('Sucesso', 'Configurações personalizadas salvas com sucesso!');
    onClose();
  };

  // Resetar para as configurações padrão
  const handleReset = () => {
    Alert.alert(
      'Confirmar',
      'Deseja remover as configurações personalizadas deste exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetar', 
          style: 'destructive',
          onPress: () => {
            resetExerciseSettings(exercise.id);
            Alert.alert('Sucesso', 'Configurações resetadas para o padrão');
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurar Exercício</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {exercise && (
            <ScrollView style={styles.scrollView}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={[
                  styles.difficultyBadge, 
                  exercise.difficulty === 'Iniciante' ? styles.beginnerBadge : 
                  exercise.difficulty === 'Intermediário' ? styles.intermediateBadge : 
                  styles.advancedBadge
                ]}>
                  <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                </View>
              </View>
              
              {hasCustom && (
                <View style={styles.customSettingsInfo}>
                  <MaterialIcons name="info-outline" size={18} color="#3F51B5" />
                  <Text style={styles.customSettingsText}>
                    Este exercício usa configurações personalizadas
                  </Text>
                </View>
              )}
              
              <Text style={styles.sectionTitle}>Configurações personalizadas:</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tempo de Preparação (seg)</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.preparation}
                  onChangeText={(text) => setTempSettings({...tempSettings, preparation: text})}
                  keyboardType="numeric"
                  placeholder={DEFAULT_SETTINGS.preparationTime.toString()}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tempo de Exercício (seg)</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.exercise}
                  onChangeText={(text) => setTempSettings({...tempSettings, exercise: text})}
                  keyboardType="numeric"
                  placeholder={DEFAULT_SETTINGS.exerciseTime.toString()}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tempo de Descanso (seg)</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.rest}
                  onChangeText={(text) => setTempSettings({...tempSettings, rest: text})}
                  keyboardType="numeric"
                  placeholder={DEFAULT_SETTINGS.restTime.toString()}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de Ciclos</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.cycles}
                  onChangeText={(text) => setTempSettings({...tempSettings, cycles: text})}
                  keyboardType="numeric"
                  placeholder={DEFAULT_SETTINGS.cycles.toString()}
                  placeholderTextColor="#888"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de Conjuntos</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.sets}
                  onChangeText={(text) => setTempSettings({...tempSettings, sets: text})}
                  keyboardType="numeric"
                  placeholder={DEFAULT_SETTINGS.sets.toString()}
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.buttonContainer}>
                {hasCustom && (
                  <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                    <Text style={styles.buttonText}>Resetar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.helperText}>
                * Deixe em branco para usar os valores padrão
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#222',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    padding: 15,
  },
  exerciseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  exerciseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  difficultyBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  beginnerBadge: {
    backgroundColor: '#4CAF50',
  },
  intermediateBadge: {
    backgroundColor: '#FF9800',
  },
  advancedBadge: {
    backgroundColor: '#F44336',
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  customSettingsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 81, 181, 0.2)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  customSettingsText: {
    color: '#a0a0ff',
    marginLeft: 8,
    fontSize: 14,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#b22222',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#00dd99',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helperText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ExerciseSettings; 