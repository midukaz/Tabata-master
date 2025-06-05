import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TabataSettings from './TabataSettings';
import DailyExercises from './DailyExercises';

export default function ButtonHome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TimerDisplay />
        <TimerControls />
        <DailyExercises />
        <TabataSettings />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
