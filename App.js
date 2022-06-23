import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/routes';



export default function App() {
  return (
  <NavigationContainer>
    <Routes/>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#474a51',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
