import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ConfigOptions from './ConfigOptions';

export default function ButtonConfig() {
    return (
        <SafeAreaView style={styles.container}>
            <ConfigOptions />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212'
    }
});

