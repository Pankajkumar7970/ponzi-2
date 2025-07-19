import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import PonziSimulation from './screens/PonziSimulation';
import PonziEducation from './screens/PonziEducation';
import PyramidSimulation from './screens/PyramidSimulation';

const Stack = createStackNavigator();

function AppContent() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PonziSimulation"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <ThemeToggle />,
          headerRightContainerStyle: { paddingRight: 16 },
        }}>
        <Stack.Navigator
        <Stack.Screen
          name="PonziSimulation"
          component={PonziSimulation}
          options={{ title: 'Ponzi Scheme Simulator' }}
        />
        <Stack.Screen
          name="PyramidSimulation"
          component={PyramidSimulation}
          options={{ title: 'Pyramid/MLM Simulator' }}
        />
        <Stack.Screen
          name="PonziEducation"
          component={PonziEducation}
          options={{ title: 'What is a Ponzi Scheme?' }}
        />
      </Stack.Navigator>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  )
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}