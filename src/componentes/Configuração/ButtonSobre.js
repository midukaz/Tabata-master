import { StyleSheet, Text, View } from 'react-native';
import {TouchableOpacity } from 'react-native';


export default function ButtonSobre({title, onpress, onChange}) {
     return(
        
            <TouchableOpacity onPress={onpress}>
                <View style={styles.container}>
                    <Text style={styles.txt}>{title}</Text>
                </View>
             
            </TouchableOpacity>
        
    )
}




const styles = StyleSheet.create({
   container: {
      backgroundColor: '#c0c0c0',
        // alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginVertical: 40,
        // borderWidth: 5,
        // borderColor: '#008000',
        // marginBottom: 15,

    },
    txt:{
        fontSize: 18,
        fontWeight:'bold'
    }
  });
