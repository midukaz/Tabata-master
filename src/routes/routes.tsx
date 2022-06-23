import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ButtonHome from "../componentes/ButtonHome";
import ButtonMenu from "../componentes/ButtonMenu";
import ButtonConfig from "../componentes/ButtonConfig";
import { Entypo, Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function(){
    return(
        <Tab.Navigator screenOptions={{
            headerShown:false,
            
          
            
        }}>
           
            <Tab.Screen 
            name="Home" 
            component={ButtonHome} 
            options={{
                tabBarIcon: ({ size, color }) => (
                    <Entypo name="home" size={size} color={color} /> 
                ) 
            }} 
            />

            <Tab.Screen 
            name="List" 
            component={ButtonMenu} 
            options={{
                tabBarIcon: ({ size, color }) => (
                    <Entypo name="menu" size={size} color={color} /> 
                )
            }}
            />

            <Tab.Screen 
            name="Config" 
            component={ButtonConfig} 
            options={{
                tabBarIcon: ({ size, color }) => (
                    <Entypo name="cog" size={size} color={color} /> 
                )
            }}
            />

        </Tab.Navigator>
    )
}
