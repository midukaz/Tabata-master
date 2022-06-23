import { StyleSheet, Text, View } from 'react-native';
import {TouchableOpacity } from 'react-native';

const Button = ({labelButton, onpress}) => {
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
      backgroundColor: '#b22222',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      borderRadius: 40,
      paddingVertical: 60,
      paddingHorizontal: 140,
      borderWidth: 5,
      borderColor: '#e9967a',
      marginBottom: 15,
    },
    labelButton:{
        fontSize:30,
        fontWeight:'bold'
    }
  });
