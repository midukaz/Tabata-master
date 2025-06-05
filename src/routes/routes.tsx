import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Platform } from "react-native";
import ButtonHome from "../componentes/ButtonHome";
import ButtonMenu from "../componentes/ButtonMenu";
import ButtonConfig from "../componentes/ButtonConfig";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function() {
    return(
        <Tab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#00dd99',
                tabBarInactiveTintColor: '#aaaaaa',
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: true,
                tabBarAllowFontScaling: false,
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelPosition: 'below-icon',
                tabBarBackground: () => (
                    <View style={styles.tabBarBackground} />
                ),
            }}
        >
           
            <Tab.Screen 
                name="Home" 
                component={ButtonHome} 
                options={{
                    tabBarLabel: 'Timer',
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons name="timer-outline" size={size + 2} color={color} /> 
                    ),
                }} 
            />

            <Tab.Screen 
                name="List" 
                component={ButtonMenu} 
                options={{
                    tabBarLabel: 'Exercícios',
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons name="fitness-center" size={size} color={color} /> 
                    )
                }}
            />

            <Tab.Screen 
                name="Config" 
                component={ButtonConfig} 
                options={{
                    tabBarLabel: 'Configurações',
                    tabBarIcon: ({ size, color }) => (
                        <MaterialIcons name="settings" size={size} color={color} /> 
                    )
                }}
            />

        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#222222',
        borderTopWidth: 0,
        elevation: 10,
        height: Platform.OS === 'ios' ? 85 : 65,
        paddingBottom: Platform.OS === 'ios' ? 25 : 5,
        paddingTop: 5,
    },
    tabBarBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#222222',
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 0,
        paddingTop: 0,
    },
    tabBarItem: {
        padding: 0,
        marginBottom: Platform.OS === 'ios' ? 5 : 0,
    }
});
