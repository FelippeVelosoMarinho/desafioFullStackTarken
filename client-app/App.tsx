import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Library from './src/screens/Library';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Library"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Library" component={Library} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
