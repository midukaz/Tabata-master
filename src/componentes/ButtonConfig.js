import React from 'react';
import { SafeAreaView, StyleSheet, Text, View ,Image,TouchableOpacity} from 'react-native';
import ButtonSobre from './Configuração/ButtonSobre';

export default function(){
    const msg = () => {
        alert('versão 1.0.1');
    }
    return (
        <View>

        <ButtonSobre title="Sobre" onpress={msg} />
        
        
        </View>
    )
}

