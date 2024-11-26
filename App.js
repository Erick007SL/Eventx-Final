import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./screens/Login";
import Principal from "./screens/Principal";
import Cadastro from './screens/Cadastro';
import DetalhesEvento from './screens/DetalhesEvento';


const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
      <Stack.Screen name="Principal" component={Principal} options={{headerShown:false}}/>
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="DetalhesEvento" component={DetalhesEvento} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

