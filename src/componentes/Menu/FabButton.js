import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, TouchableOpacity, Vibration } from 'react-native';
import { AntDesign, Entypo, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default class FabButton extends Component {
   constructor(props) {
      super(props);
      this.state = {
         open: false,
         animation: new Animated.Value(0),
         bgAnimation: new Animated.Value(0),
      };
   }

   toggleMenu = () => {
      const toValue = this.state.open ? 0 : 1;
      
      // Animar o botão principal
      Animated.spring(this.state.animation, {
         toValue,
         friction: 6,
         tension: 80,
         useNativeDriver: false,
      }).start();

      // Animar o fundo do botão flutuante
      Animated.timing(this.state.bgAnimation, {
         toValue,
         duration: 300,
         useNativeDriver: false,
      }).start();
      
      // Dar feedback de vibração leve ao abrir/fechar
      Vibration.vibrate(10);
      
      this.setState({ open: !this.state.open });
   }

   render() {
      const { open, animation, bgAnimation } = this.state;

      // Rotação do ícone principal
      const rotation = {
         transform: [
            { 
               rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg']
               })
            }
         ]
      };

      // Animação do fundo semi-transparente
      const backdropOpacity = bgAnimation.interpolate({
         inputRange: [0, 1],
         outputRange: [0, 0.5]
      });

      // Animações para os botões do menu
      const favoritesStyle = {
         transform: [
            { scale: animation },
            { 
               translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -70]
               })
            }
         ],
         opacity: animation
      };

      const customStyle = {
         transform: [
            { scale: animation },
            { 
               translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -140]
               })
            }
         ],
         opacity: animation
      };

      const popularStyle = {
         transform: [
            { scale: animation },
            { 
               translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -210]
               })
            }
         ],
         opacity: animation
      };

      // Animação para os textos de cada botão
      const textOpacity = animation;

      return(
         <View style={[styles.container, this.props.style]}>
            {/* Fundo escurecido ao abrir o menu */}
            {open && (
               <TouchableWithoutFeedback onPress={this.toggleMenu}>
                  <Animated.View 
                     style={[
                        styles.backdrop,
                        { opacity: backdropOpacity }
                     ]} 
                  />
               </TouchableWithoutFeedback>
            )}

            {/* Menu de opções */}
            <TouchableWithoutFeedback onPress={() => alert('Exercícios Populares')}>
               <Animated.View style={[styles.button, styles.submenu, popularStyle, { backgroundColor: '#FF9800' }]}>
                  <MaterialIcons name="trending-up" size={22} color="#FFF" />
                  <Animated.View style={[styles.labelContainer, { opacity: textOpacity }]}>
                     <Text style={styles.labelText}>Populares</Text>
                  </Animated.View>
               </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => alert('Exercícios Personalizados')}>
               <Animated.View style={[styles.button, styles.submenu, customStyle, { backgroundColor: '#2196F3' }]}>
                  <FontAwesome5 name="dumbbell" size={20} color="#FFF" />
                  <Animated.View style={[styles.labelContainer, { opacity: textOpacity }]}>
                     <Text style={styles.labelText}>Personalizar</Text>
                  </Animated.View>
               </Animated.View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => alert('Exercícios Favoritos')}>
               <Animated.View style={[styles.button, styles.submenu, favoritesStyle, { backgroundColor: '#F44336' }]}>
                  <Entypo name="heart" size={22} color="#FFF" />
                  <Animated.View style={[styles.labelContainer, { opacity: textOpacity }]}>
                     <Text style={styles.labelText}>Favoritos</Text>
                  </Animated.View>
               </Animated.View>
            </TouchableWithoutFeedback>

            {/* Botão principal */}
            <TouchableWithoutFeedback onPress={this.toggleMenu}>
               <Animated.View style={[styles.button, styles.menu, rotation]}>
                  <AntDesign name="plus" size={24} color="#FFF" />
               </Animated.View>
            </TouchableWithoutFeedback>
         </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        right: 30,
        zIndex: 999,
    },
    backdrop: {
        position: 'absolute',
        top: -1000,
        left: -1000,
        right: -1000,
        bottom: -1000,
        backgroundColor: '#000',
        zIndex: 1,
    },
    button: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: {
            height: 5,
            width: 0,
        },
        elevation: 8,
        zIndex: 10,
    },
    menu: {
        backgroundColor: '#00dd99',
    },
    submenu: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    labelContainer: {
        position: 'absolute',
        right: 60,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    labelText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    }
});