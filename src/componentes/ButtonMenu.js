import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import FabButton from './Menu/FabButton';
import ExerciseList from './ExerciseList';

export default function ButtonMenu() {
    return (
        <SafeAreaView style={styles.container}>
            <ExerciseList />
            <FabButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212'
    }
});