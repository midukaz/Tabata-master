import React from 'react';
import { SafeAreaView, StyleSheet, Text, View ,Image,TouchableOpacity, Button, Alert} from 'react-native';
import ButtonComecar from './Home/ButtonComecar';
import ButtonDescanso from './Home/ButtonDescanso';
import ButtonExercicios from './Home/ButtonExercicios';
import ButtonPreparacao from './Home/ButtonPreparacao';

export default function(){
    const signIn = () => {
        alert('cliques');
    }
    
    return(
        <View style={styles.container}>
            
            <ButtonPreparacao labelButton="Preparaçao" onpress={signIn} />

            <ButtonExercicios labelButton="Exercícios" onpress={signIn} />
                        
            <ButtonDescanso labelButton="Descanso" onpress={signIn} />

            <ButtonComecar labelButton="Começar" onpress={signIn} />
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212'
    
    },
    text:{
        fontSize: 25,
        fontWeight: 'bold'
    }
});
