import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/routes';
import { TabataProvider } from './src/context/TabataContext';
import { WeeklyPlanProvider } from './src/context/WeeklyPlanContext';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <TabataProvider>
        <WeeklyPlanProvider>
          <Routes />
        </WeeklyPlanProvider>
      </TabataProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
