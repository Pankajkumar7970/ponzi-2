import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import PonziSimulation from './screens/PonziSimulation';
import PonziEducation from './screens/PonziEducation';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="PonziSimulation"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="PonziSimulation"
            component={PonziSimulation}
            options={{ title: 'Ponzi Scheme Simulator' }}
          />
          <Stack.Screen
            name="PonziEducation"
            component={PonziEducation}
            options={{ title: 'What is a Ponzi Scheme?' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}