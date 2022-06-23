import { StyleSheet, Text, View } from 'react-native';
import {TouchableOpacity } from 'react-native';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'
import Cronometro from './Cronometro';

const Button = ({labelButton, onpress, Cronometro}) => {
    return(
        <View style={styles.button}>
            <TouchableOpacity
                onPress={onpress}
            >
                
                <Text>{labelButton}</Text> 
            </TouchableOpacity>
        </View>
    )
}


export default Button

const styles = StyleSheet.create({
   button: {
      backgroundColor: '#7fff00',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 40,
        paddingVertical: 60,
        paddingHorizontal: 140,
        borderWidth: 5,
        borderColor: '#008000',
        marginBottom: 15,
        marginVertical: 40,

    },
    labelButton:{
        fontSize:30,
        fontWeight:'bold'
    }
  });
