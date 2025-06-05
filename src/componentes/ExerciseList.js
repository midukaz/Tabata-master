import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTabata } from '../context/TabataContext';
import { useWeeklyPlan } from '../context/WeeklyPlanContext';
import ExerciseSettings from './ExerciseSettings';

// Lista de exercícios com detalhes
const exercisesList = [
  {
    id: '1',
    name: 'Burpees',
    description: 'Um exercício completo que trabalha todo o corpo. Comece em pé, agache, coloque as mãos no chão, jogue as pernas para trás ficando em posição de prancha, faça uma flexão, volte para a posição agachada e salte.',
    category: 'Cardio',
    difficulty: 'Avançado',
    muscleGroups: 'Corpo inteiro',
  },
  {
    id: '2',
    name: 'Jumping Jacks',
    description: 'Um exercício cardiovascular clássico. Comece em pé com os pés juntos e os braços ao lado do corpo. Salte abrindo as pernas e levando os braços acima da cabeça, depois volte à posição inicial.',
    category: 'Cardio',
    difficulty: 'Iniciante',
    muscleGroups: 'Corpo inteiro',
  },
  {
    id: '3',
    name: 'Mountain Climbers',
    description: 'Comece na posição de prancha, com as mãos abaixo dos ombros. Traga alternadamente os joelhos em direção ao peito em um movimento de corrida.',
    category: 'Cardio',
    difficulty: 'Intermediário',
    muscleGroups: 'Core, Ombros, Peito',
  },
  {
    id: '4',
    name: 'Agachamentos',
    description: 'Fique em pé com os pés na largura dos ombros. Flexione os joelhos e quadris como se fosse sentar em uma cadeira imaginária, mantendo o peito erguido e o peso nos calcanhares.',
    category: 'Força',
    difficulty: 'Iniciante',
    muscleGroups: 'Quadríceps, Glúteos, Isquiotibiais',
  },
  {
    id: '5',
    name: 'Prancha',
    description: 'Apoie-se nos antebraços e nas pontas dos pés, mantendo o corpo em linha reta da cabeça aos calcanhares. Mantenha o core contraído.',
    category: 'Força',
    difficulty: 'Intermediário',
    muscleGroups: 'Core, Ombros',
  },
  {
    id: '6',
    name: 'Push-ups (Flexões)',
    description: 'Comece na posição de prancha com as mãos um pouco mais largas que os ombros. Flexione os cotovelos para baixar o corpo até quase tocar o chão, depois empurre para cima.',
    category: 'Força',
    difficulty: 'Intermediário',
    muscleGroups: 'Peito, Tríceps, Ombros, Core',
  },
  {
    id: '7',
    name: 'Bicycle Crunches',
    description: 'Deite de costas, levante as pernas e dobre os joelhos. Coloque as mãos atrás da cabeça e alterne tocando o cotovelo no joelho oposto.',
    category: 'Força',
    difficulty: 'Intermediário',
    muscleGroups: 'Core, Oblíquos',
  },
  {
    id: '8',
    name: 'Jumping Lunges',
    description: 'Comece em posição de afundo, salte e troque as pernas no ar, aterrissando com a outra perna à frente.',
    category: 'Cardio',
    difficulty: 'Avançado',
    muscleGroups: 'Quadríceps, Glúteos, Isquiotibiais',
  },
  {
    id: '9',
    name: 'High Knees',
    description: 'Corra no lugar levantando os joelhos o mais alto possível, até a altura do quadril se possível.',
    category: 'Cardio',
    difficulty: 'Iniciante',
    muscleGroups: 'Quadríceps, Core',
  },
  {
    id: '10',
    name: 'Skater Jumps',
    description: 'Salte lateralmente de um pé para o outro, como um patinador, levando a perna de trás cruzada para trás do corpo.',
    category: 'Cardio',
    difficulty: 'Intermediário',
    muscleGroups: 'Pernas, Glúteos',
  },
  {
    id: '11',
    name: 'Russian Twists',
    description: 'Sente-se com os joelhos dobrados e os pés levantados. Incline o tronco para trás e gire de um lado para o outro, tocando o chão com as mãos.',
    category: 'Força',
    difficulty: 'Intermediário',
    muscleGroups: 'Core, Oblíquos',
  },
  {
    id: '12',
    name: 'Jump Squats',
    description: 'Realize um agachamento normal, mas na subida, impulsione-se em um salto explosivo. Aterrisse suavemente voltando à posição de agachamento.',
    category: 'Cardio',
    difficulty: 'Intermediário',
    muscleGroups: 'Quadríceps, Glúteos',
  },
];

const ExerciseList = () => {
  const navigation = useNavigation();
  const tabata = useTabata();
  const { 
    addExerciseToDay, 
    removeExerciseFromDay, 
    getExercisesForDay,
    WEEKDAYS, 
    weeklyPlan 
  } = useWeeklyPlan();
  
  const { hasCustomSettings } = useTabata();
  
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [weeklyModalVisible, setWeeklyModalVisible] = useState(false);
  const [weeklyPlanModalVisible, setWeeklyPlanModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Forçar atualização da interface
  const forceUpdate = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  // Efeito para atualizar a interface quando o plano semanal mudar
  useEffect(() => {
    console.log("Plano semanal atualizado:", weeklyPlan);
    forceUpdate();
  }, [weeklyPlan]);

  // Filtrar os exercícios
  const filteredExercises = filterCategory === 'Todos' 
    ? exercisesList 
    : exercisesList.filter(exercise => exercise.category === filterCategory);

  // Iniciar exercício e navegar para Home
  const handleStartExercise = () => {
    try {
      if (tabata && typeof tabata.startExerciseFromList === 'function') {
        tabata.startExerciseFromList(selectedExercise);
        setModalVisible(false);
        navigation.navigate('Home');
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível iniciar o exercício. Tente novamente mais tarde.',
          [{ text: 'OK', onPress: () => setModalVisible(false) }]
        );
      }
    } catch (error) {
      console.error("Erro ao iniciar exercício:", error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao iniciar o exercício.',
        [{ text: 'OK', onPress: () => setModalVisible(false) }]
      );
    }
  };

  // Verificar se o exercício já está programado em algum dia
  const findExerciseInWeeklyPlan = (exercise) => {
    if (!exercise) return [];
    
    const days = [];
    WEEKDAYS.forEach(day => {
      const exercisesForDay = getExercisesForDay(day);
      if (exercisesForDay.some(ex => ex.id === exercise.id)) {
        days.push(day);
      }
    });
    return days;
  };

  // Abrir o modal para escolher o dia da semana
  const handleAddToWeeklyPlan = () => {
    setWeeklyModalVisible(true);
  };

  // Adicionar o exercício ao dia selecionado
  const handleAddToDay = (day) => {
    addExerciseToDay(selectedExercise, day);
    setWeeklyModalVisible(false);
  };

  // Remover o exercício de um dia
  const handleRemoveFromDay = (day) => {
    if (!selectedExercise) return;
    
    Alert.alert(
      'Confirmar remoção',
      `Deseja remover ${selectedExercise.name} de ${day}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            console.log(`Removendo exercício ID ${selectedExercise.id} do dia ${day}`);
            const result = removeExerciseFromDay(selectedExercise.id, day);
            
            // Forçar atualização após a remoção
            forceUpdate();
            
            if (result) {
              // Mostrar feedback após a remoção
              Alert.alert('Sucesso', `${selectedExercise.name} removido de ${day}`);
              
              // Fechar o modal
              setWeeklyModalVisible(false);
            } else {
              Alert.alert('Erro', 'Não foi possível remover o exercício. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  // Remover exercício diretamente do plano semanal
  const handleRemoveDirectly = (exercise, day) => {
    if (!exercise) return;
    
    Alert.alert(
      'Confirmar remoção',
      `Deseja remover ${exercise.name} de ${day}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: () => {
            console.log(`Removendo exercício ID ${exercise.id} do dia ${day}`);
            const result = removeExerciseFromDay(exercise.id, day);
            
            // Forçar atualização após a remoção
            forceUpdate();
            
            if (result) {
              // Mostrar feedback após a remoção
              Alert.alert('Sucesso', `${exercise.name} removido de ${day}`);
            } else {
              Alert.alert('Erro', 'Não foi possível remover o exercício. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  // Renderizar cada item da lista
  const renderExerciseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.exerciseItem}
      onPress={() => {
        setSelectedExercise(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={styles.badgeContainer}>
          {hasCustomSettings(item.id) && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>Personalizado</Text>
            </View>
          )}
          <View style={[
            styles.difficultyBadge, 
            item.difficulty === 'Iniciante' ? styles.beginnerBadge : 
            item.difficulty === 'Intermediário' ? styles.intermediateBadge : 
            styles.advancedBadge
          ]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.exerciseCategory}>{item.category} | {item.muscleGroups}</Text>
      <Text style={styles.exercisePreview}>{item.description.substring(0, 80)}...</Text>
      <Text style={styles.viewMore}>Toque para ver mais <Entypo name="chevron-right" size={12} /></Text>
    </TouchableOpacity>
  );

  // Renderizar item do plano semanal
  const renderWeeklyPlanItem = (day) => {
    const exercisesForDay = getExercisesForDay(day);
    
    return (
      <View key={`${day}-${refreshKey}`} style={styles.weeklyPlanDay}>
        <Text style={styles.weeklyPlanDayTitle}>{day}</Text>
        {exercisesForDay.length > 0 ? (
          exercisesForDay.map((exercise) => (
            <View key={`${exercise.id}-${refreshKey}`} style={styles.weeklyPlanExercise}>
              <Text style={styles.weeklyPlanExerciseName}>{exercise.name}</Text>
              <View style={styles.weeklyPlanActions}>
                <View style={[
                  styles.miniDifficultyBadge, 
                  exercise.difficulty === 'Iniciante' ? styles.beginnerBadge : 
                  exercise.difficulty === 'Intermediário' ? styles.intermediateBadge : 
                  styles.advancedBadge
                ]}>
                  <Text style={styles.miniDifficultyText}>{exercise.difficulty}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveDirectly(exercise, day)}
                >
                  <MaterialIcons name="delete-outline" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.weeklyPlanEmptyText}>Nenhum exercício</Text>
        )}
      </View>
    );
  };

  // Renderizar botão dependendo se o exercício já está no dia
  const renderDayButton = (day) => {
    if (!selectedExercise) return null;
    
    const exercisesForDay = getExercisesForDay(day);
    const isScheduled = exercisesForDay.some(ex => ex.id === selectedExercise.id);
    
    return (
      <TouchableOpacity
        key={`${day}-${refreshKey}`}
        style={[styles.dayButton, isScheduled ? styles.scheduledDayButton : {}]}
        onPress={() => {
          if (isScheduled) {
            handleRemoveFromDay(day);
          } else {
            handleAddToDay(day);
          }
        }}
      >
        <Text style={styles.dayButtonText}>{day}</Text>
        {isScheduled ? (
          <View style={styles.scheduledBadge}>
            <MaterialIcons name="check" size={16} color="white" />
            <Text style={styles.scheduledText}>Remover</Text>
          </View>
        ) : (
          <Text style={styles.addText}>Adicionar</Text>
        )}
      </TouchableOpacity>
    );
  };

  // Abrir o modal de configurações
  const handleOpenSettings = () => {
    setSettingsModalVisible(true);
    setModalVisible(false);
  };

  // Fechar o modal de configurações e reabrir o modal de detalhes
  const handleCloseSettings = () => {
    setSettingsModalVisible(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercícios Tabata</Text>
        <TouchableOpacity 
          style={styles.weeklyPlanButton}
          onPress={() => setWeeklyPlanModalVisible(true)}
        >
          <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Filtros de categoria */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filterCategory === 'Todos' && styles.activeFilter]}
          onPress={() => setFilterCategory('Todos')}
        >
          <Text style={[styles.filterText, filterCategory === 'Todos' && styles.activeFilterText]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filterCategory === 'Cardio' && styles.activeFilter]}
          onPress={() => setFilterCategory('Cardio')}
        >
          <Text style={[styles.filterText, filterCategory === 'Cardio' && styles.activeFilterText]}>Cardio</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filterCategory === 'Força' && styles.activeFilter]}
          onPress={() => setFilterCategory('Força')}
        >
          <Text style={[styles.filterText, filterCategory === 'Força' && styles.activeFilterText]}>Força</Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de exercícios */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      
      {/* Modal de detalhes do exercício */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedExercise && (
              <>
                <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                <View style={styles.modalImageContainer}>
                  <View style={styles.modalImage} />
                </View>
                <View style={styles.badgeRow}>
                  <View style={[
                    styles.difficultyBadge, 
                    selectedExercise.difficulty === 'Iniciante' ? styles.beginnerBadge : 
                    selectedExercise.difficulty === 'Intermediário' ? styles.intermediateBadge : 
                    styles.advancedBadge
                  ]}>
                    <Text style={styles.difficultyText}>{selectedExercise.difficulty}</Text>
                  </View>
                  
                  {hasCustomSettings(selectedExercise.id) && (
                    <View style={styles.customBadge}>
                      <Text style={styles.customBadgeText}>Personalizado</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.modalCategory}>{selectedExercise.category} | {selectedExercise.muscleGroups}</Text>
                <Text style={styles.modalDescription}>{selectedExercise.description}</Text>
                
                {/* Mostrar dias em que o exercício está programado */}
                {findExerciseInWeeklyPlan(selectedExercise).length > 0 && (
                  <View style={styles.scheduledDaysContainer}>
                    <Text style={styles.scheduledDaysTitle}>Programado para:</Text>
                    <View style={styles.scheduledDaysList}>
                      {findExerciseInWeeklyPlan(selectedExercise).map(day => (
                        <View key={day} style={styles.scheduledDayChip}>
                          <Text style={styles.scheduledDayChipText}>{day}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                <View style={styles.buttonRow}>
                  {/* Botão para iniciar o exercício */}
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={handleStartExercise}
                  >
                    <Text style={styles.startButtonText}>Iniciar Exercício</Text>
                  </TouchableOpacity>
                  
                  {/* Botão para adicionar ao plano semanal */}
                  <TouchableOpacity 
                    style={styles.weeklyButton}
                    onPress={handleAddToWeeklyPlan}
                  >
                    <MaterialIcons name="add-task" size={20} color="white" />
                    <Text style={styles.weeklyButtonText}>Gerenciar no Plano</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Botão para personalizar configurações */}
                <TouchableOpacity 
                  style={styles.settingsButton}
                  onPress={handleOpenSettings}
                >
                  <MaterialIcons name="settings" size={20} color="white" />
                  <Text style={styles.settingsButtonText}>Personalizar Configurações</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Modal para selecionar o dia da semana */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={weeklyModalVisible}
        onRequestClose={() => setWeeklyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.weeklyModalContent]}>
            <Text style={styles.modalTitle}>Gerenciar Exercício</Text>
            <Text style={styles.modalSubtitle}>
              Selecione os dias para adicionar ou remover o exercício
            </Text>
            {WEEKDAYS.map(renderDayButton)}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWeeklyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Modal para visualizar o plano semanal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={weeklyPlanModalVisible}
        onRequestClose={() => setWeeklyPlanModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.weeklyPlanModalContent]}>
            <Text style={styles.modalTitle}>Plano Semanal</Text>
            <ScrollView style={styles.weeklyPlanScroll}>
              {WEEKDAYS.map(renderWeeklyPlanItem)}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWeeklyPlanModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Modal para configurações personalizadas */}
      {selectedExercise && (
        <ExerciseSettings 
          exercise={selectedExercise}
          visible={settingsModalVisible}
          onClose={handleCloseSettings}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  weeklyPlanButton: {
    backgroundColor: '#00dd99',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#00dd99',
  },
  filterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#121212',
  },
  list: {
    flex: 1,
  },
  exerciseItem: {
    backgroundColor: '#222',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00dd99',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingVertical: 4,
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseCategory: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  exercisePreview: {
    color: 'white',
    marginBottom: 8,
  },
  viewMore: {
    color: '#00dd99',
    textAlign: 'right',
    fontSize: 12,
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
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  weeklyModalContent: {
    maxHeight: '70%',
  },
  weeklyPlanModalContent: {
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#333', // Placeholder background
  },
  modalCategory: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    color: 'white',
    marginBottom: 20,
    lineHeight: 22,
  },
  scheduledDaysContainer: {
    marginBottom: 16,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  scheduledDaysTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scheduledDaysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scheduledDayChip: {
    backgroundColor: '#555',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  scheduledDayChipText: {
    color: 'white',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  weeklyButton: {
    backgroundColor: '#3F51B5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  weeklyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  closeButton: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayButton: {
    backgroundColor: '#2C2C2C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduledDayButton: {
    backgroundColor: '#1F3A53',
    borderLeftWidth: 3,
    borderLeftColor: '#3F51B5',
  },
  dayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduledText: {
    color: '#FF5252',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  addText: {
    color: '#00dd99',
    fontSize: 14,
  },
  weeklyPlanScroll: {
    maxHeight: '80%',
  },
  weeklyPlanDay: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  weeklyPlanDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 8,
  },
  weeklyPlanExercise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  weeklyPlanExerciseName: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  weeklyPlanActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniDifficultyBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  miniDifficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyPlanEmptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customBadge: {
    backgroundColor: '#3F51B5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  customBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  settingsButton: {
    backgroundColor: '#555',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  settingsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ExerciseList; 