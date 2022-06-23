import React from 'react';
import { SafeAreaView, StyleSheet, Text, View ,Image,TouchableOpacity} from 'react-native';
import FabButton from './Menu/FabButton';



export default function App(){
    return(
        <View style={styles.container}>
            <FabButton/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
     
        backgroundColor: '#FFF'
    },
    text:{
        fontSize: 25,
        fontWeight: 'bold'
    }
});