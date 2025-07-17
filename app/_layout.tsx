import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <SQLiteProvider 
      databaseName="Inventory.db" 
      assetSource={{ assetId: require('../assets/Inventory.db') }}
        
    >
      <StatusBar style="auto" />
      <Tabs>
        <Tabs.Screen 
          name="Scan" 
          options={{
            tabBarIcon: () => <Entypo name="camera" size={24} color="black" />
          }}  
        />  
        <Tabs.Screen 
          name="index"        
          options={{
            title: "Home",
            tabBarIcon: () => <Entypo name="home" size={24} color="black" />
          }}  
        />       
        <Tabs.Screen 
          name="Inventory" 
          options={{
            title: "Inventory",
            tabBarIcon: () => <MaterialIcons name="storage" size={24} color="black" />
          }}  
        />  
      </Tabs>
    </SQLiteProvider>
  );
}