import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { useWeeklyPlan } from '../context/WeeklyPlanContext';
import { useTabata } from '../context/TabataContext';

const DailyExercises = () => {
  const { weeklyPlan, WEEKDAYS } = useWeeklyPlan();
  const { startExerciseFromList, hasCustomSettings } = useTabata();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [exercisesForDay, setExercisesForDay] = useState([]);
  
  // Obter o dia atual
  function getCurrentDay() {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 para Domingo, 1 para Segunda, etc.
    return WEEKDAYS[dayIndex];
  }
  
  // Atualizar exercícios quando o dia selecionado mudar
  useEffect(() => {
    if (selectedDay && weeklyPlan[selectedDay]) {
      setExercisesForDay(weeklyPlan[selectedDay]);
    } else {
      setExercisesForDay([]);
    }
  }, [selectedDay, weeklyPlan]);
  
  // Iniciar exercício
  const handleStartExercise = (exercise) => {
    startExerciseFromList(exercise);
    setModalVisible(false);
  };
  
  // Renderizar cada exercício
  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => handleStartExercise(item)}
    >
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={[
          styles.difficultyBadge, 
          item.difficulty === 'Iniciante' ? styles.beginnerBadge : 
          item.difficulty === 'Intermediário' ? styles.intermediateBadge : 
          styles.advancedBadge
        ]}>
          <Text style={styles.difficultyText}>{item.difficulty}</Text>
        </View>
      </View>
      
      <View style={styles.exerciseActions}>
        {hasCustomSettings(item.id) && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>Personalizado</Text>
          </View>
        )}
        <MaterialIcons name="play-arrow" size={24} color="#00dd99" />
      </View>
    </TouchableOpacity>
  );
  
  // Alternar dia selecionado
  const changeDay = (day) => {
    setSelectedDay(day);
  };
  
  // Renderizar o botão para cada dia da semana
  const renderDayButton = (day) => {
    const isSelected = day === selectedDay;
    const hasExercises = weeklyPlan[day] && weeklyPlan[day].length > 0;
    
    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayButton,
          isSelected && styles.selectedDayButton,
          !hasExercises && styles.emptyDayButton
        ]}
        onPress={() => changeDay(day)}
      >
        <Text style={[
          styles.dayButtonText,
          isSelected && styles.selectedDayText
        ]}>
          {day.substring(0, 3)}
        </Text>
        {hasExercises && (
          <View style={styles.exerciseCountBadge}>
            <Text style={styles.exerciseCountText}>{weeklyPlan[day].length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dailyButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="fitness-center" size={24} color="white" />
        <Text style={styles.dailyButtonText}>Exercícios de Hoje</Text>
        {exercisesForDay.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{exercisesForDay.length}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exercícios do Dia</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Entypo name="cross" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.daySelector}>
              {WEEKDAYS.map(renderDayButton)}
            </View>
            
            {exercisesForDay.length > 0 ? (
              <FlatList
                data={exercisesForDay}
                renderItem={renderExerciseItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.exerciseList}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum exercício programado para {selectedDay}</Text>
                <Text style={styles.emptySubtext}>Adicione exercícios na aba "Lista"</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dailyButton: {
    backgroundColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
  },
  dailyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: '#00dd99',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  countText: {
    color: '#121212',
    fontSize: 12,
    fontWeight: 'bold',
  },
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
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#2a2a2a',
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#444',
    position: 'relative',
  },
  selectedDayButton: {
    backgroundColor: '#00dd99',
  },
  emptyDayButton: {
    opacity: 0.6,
  },
  dayButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#121212',
  },
  exerciseCountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff6b6b',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  exerciseList: {
    padding: 10,
  },
  exerciseItem: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  difficultyBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
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
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customBadge: {
    backgroundColor: '#3F51B5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  customBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DailyExercises; 