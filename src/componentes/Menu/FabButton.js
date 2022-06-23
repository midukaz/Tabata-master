import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';


export default class FabButton extends Component {
   render(){
    return(
        <View style={[Styles.container, this.props.style]}>
            <TouchableWithoutFeedback>
                <Animated.View style={[Styles.button, Styles.menu]}>
                    <AntDesign name="plus" size={24} color="#FFF" />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
      );
    }
}

const Styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        position: 'absolute'
    },

    button:{
        position: 'relative',
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: '10',
        shadowColor:'#00213B',
        shadowOpacity: '0.3',
        shadowOffset: {
            height: 10,
        }
    },
    menu: {
        backgroundColor: '#00213b'
    }
});