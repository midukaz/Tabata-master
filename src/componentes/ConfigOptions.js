import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Image } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, AntDesign, Feather } from '@expo/vector-icons';

const ConfigOptions = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [countdownBeforeStart, setCountdownBeforeStart] = useState(true);
  const [keepScreenOn, setKeepScreenOn] = useState(true);
  
  const [customTimerModalVisible, setCustomTimerModalVisible] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    preparation: '10',
    exercise: '20',
    rest: '10',
    cycles: '8',
    sets: '1',
  });

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const themes = [
    { name: 'Padrão', primary: '#00dd99', secondary: '#121212' },
    { name: 'Azul', primary: '#2196F3', secondary: '#0D47A1' },
    { name: 'Vermelho', primary: '#F44336', secondary: '#B71C1C' },
    { name: 'Roxo', primary: '#9C27B0', secondary: '#4A148C' },
    { name: 'Laranja', primary: '#FF9800', secondary: '#E65100' },
  ];
  const [selectedTheme, setSelectedTheme] = useState(0);

  const handleSaveTimerSettings = () => {
    // Converter para números e validar
    const preparation = parseInt(timerSettings.preparation);
    const exercise = parseInt(timerSettings.exercise);
    const rest = parseInt(timerSettings.rest);
    const cycles = parseInt(timerSettings.cycles);
    const sets = parseInt(timerSettings.sets);
    
    if (isNaN(preparation) || isNaN(exercise) || isNaN(rest) || isNaN(cycles) || isNaN(sets)) {
      Alert.alert('Erro', 'Por favor, insira valores numéricos válidos.');
      return;
    }
    
    if (preparation <= 0 || exercise <= 0 || rest <= 0 || cycles <= 0 || sets <= 0) {
      Alert.alert('Erro', 'Todos os valores devem ser maiores que zero.');
      return;
    }
    
    // Se tudo estiver válido, podemos fechar o modal
    Alert.alert('Sucesso', 'Configurações do temporizador salvas com sucesso!');
    setCustomTimerModalVisible(false);
  };

  const renderCard = (title, icon, children, color = '#00dd99') => (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { borderBottomColor: color }]}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {icon}
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const renderSwitch = (label, value, onValueChange, description = null) => (
    <View style={styles.switchItem}>
      <View style={styles.switchLabelContainer}>
        <Text style={styles.switchLabel}>{label}</Text>
        {description && (
          <Text style={styles.switchDescription}>{description}</Text>
        )}
      </View>
      <Switch
        trackColor={{ false: '#555', true: themes[selectedTheme].primary }}
        thumbColor={value ? '#fff' : '#ddd'}
        ios_backgroundColor="#555"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Personalize sua experiência de treino</Text>
      </View>
      
      {renderCard(
        'Timer Tabata',
        <MaterialIcons name="timer" size={22} color="white" />,
        <>
          <View style={styles.settingsSummary}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Preparação</Text>
              <Text style={styles.settingValue}>{timerSettings.preparation}s</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Exercício</Text>
              <Text style={styles.settingValue}>{timerSettings.exercise}s</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Descanso</Text>
              <Text style={styles.settingValue}>{timerSettings.rest}s</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Ciclos</Text>
              <Text style={styles.settingValue}>{timerSettings.cycles}</Text>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Séries</Text>
              <Text style={styles.settingValue}>{timerSettings.sets}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setCustomTimerModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Editar Configurações</Text>
            <Feather name="edit-2" size={16} color="white" />
          </TouchableOpacity>
        </>,
        '#F44336'
      )}
      
      {renderCard(
        'Som e Vibração',
        <Ionicons name="ios-volume-high" size={22} color="white" />,
        <>
          {renderSwitch('Sons de Alerta', soundEnabled, setSoundEnabled, 'Toque alertas sonoros durante o treino')}
          {renderSwitch('Vibração', vibrationEnabled, setVibrationEnabled, 'Vibrar ao mudar de estados durante o treino')}
          {renderSwitch('Contagem Regressiva', countdownBeforeStart, setCountdownBeforeStart, 'Iniciar com contagem regressiva de 3 segundos')}
        </>,
        '#FF9800'
      )}
      
      {renderCard(
        'Aparência',
        <Ionicons name="ios-color-palette" size={22} color="white" />,
        <>
          {renderSwitch('Modo Escuro', darkMode, setDarkMode, 'Usar tema escuro no aplicativo')}
          <View style={styles.themePreview}>
            <View style={[styles.themeColor, { backgroundColor: themes[selectedTheme].primary }]} />
            <Text style={styles.themeName}>Tema: {themes[selectedTheme].name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setThemeModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Escolher Tema</Text>
            <Ionicons name="color-palette-outline" size={16} color="white" />
          </TouchableOpacity>
        </>,
        '#2196F3'
      )}
      
      {renderCard(
        'Dispositivo',
        <MaterialIcons name="screen-lock-portrait" size={22} color="white" />,
        <>
          {renderSwitch('Manter Tela Ligada', keepScreenOn, setKeepScreenOn, 'Evita que a tela desligue durante o treino')}
        </>,
        '#9C27B0'
      )}
      
      {renderCard(
        'Sobre',
        <Ionicons name="ios-information-circle" size={22} color="white" />,
        <>
          <View style={styles.aboutSection}>
            <View style={styles.appInfoRow}>
              <Text style={styles.appName}>Tabata Timer</Text>
              <Text style={styles.appVersion}>v1.0.1</Text>
            </View>
            <Text style={styles.appDescription}>
              Um aplicativo para treinos Tabata de alta intensidade com controle total.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="github" size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <AntDesign name="twitter" size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome5 name="discord" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </>,
        '#4CAF50'
      )}
      
      {/* Modal para personalizar temporizador */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={customTimerModalVisible}
        onRequestClose={() => setCustomTimerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personalizar Temporizador</Text>
              <TouchableOpacity 
                onPress={() => setCustomTimerModalVisible(false)}
                style={styles.closeButton}
              >
                <AntDesign name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Preparação (segundos)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={timerSettings.preparation}
                onChangeText={(text) => setTimerSettings({...timerSettings, preparation: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Exercício (segundos)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={timerSettings.exercise}
                onChangeText={(text) => setTimerSettings({...timerSettings, exercise: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tempo de Descanso (segundos)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={timerSettings.rest}
                onChangeText={(text) => setTimerSettings({...timerSettings, rest: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de Ciclos</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={timerSettings.cycles}
                onChangeText={(text) => setTimerSettings({...timerSettings, cycles: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Número de Séries</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={timerSettings.sets}
                onChangeText={(text) => setTimerSettings({...timerSettings, sets: text})}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveTimerSettings}
            >
              <Text style={styles.saveButtonText}>Salvar Configurações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Modal para escolher tema */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.themeModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher Tema</Text>
              <TouchableOpacity 
                onPress={() => setThemeModalVisible(false)}
                style={styles.closeButton}
              >
                <AntDesign name="close" size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.themesContainer}>
              {themes.map((theme, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: theme.secondary,
                      borderColor: selectedTheme === index ? theme.primary : 'transparent',
                    }
                  ]}
                  onPress={() => setSelectedTheme(index)}
                >
                  <View style={[styles.themeColorPreview, { backgroundColor: theme.primary }]} />
                  <Text style={styles.themeOptionName}>{theme.name}</Text>
                  {selectedTheme === index && (
                    <View style={styles.selectedThemeIndicator}>
                      <AntDesign name="check" size={14} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Aplicar Tema</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00dd99',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00dd99',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContent: {
    padding: 16,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: '#aaa',
  },
  settingsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingItem: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  themeColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  themeName: {
    color: 'white',
    fontSize: 16,
  },
  aboutSection: {
    alignItems: 'center',
  },
  appInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#aaa',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  appDescription: {
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
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
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeModalContent: {
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#00dd99',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themesContainer: {
    padding: 16,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeColorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  themeOptionName: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  selectedThemeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00dd99',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConfigOptions; 