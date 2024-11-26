import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions, Linking, ScrollView, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from 'react-native-elements';
import axios from 'axios';
import Eventos from './Eventos'

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};


const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

// Feed Component
const Feed = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Início!</Text>
    </View>
  );
}


const Inicio = () => {
  // Estado para armazenar os eventos
  const [feed, setFeed] = useState([]);

  // Função para buscar os eventos da API usando axios
  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://192.168.0.110:3000/api/events'); // Substitua pela URL da sua API
      setFeed(response.data); // Atualiza o estado com os eventos recebidos
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  // UseEffect para buscar os eventos quando o componente for montado
  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {feed.length > 0 ? (
          feed.map((evento) => (
            <View key={evento.id} style={styles.cardInicio}>
              {evento.coverImage && (
                <Image
                  source={{ uri: `http://192.168.0.110:3000/uploads/${evento.coverImage}` }}
                  style={styles.cardImage} resizeMode='contain'
                />
              )}
              <Text style={styles.cardTitle}>{evento.title}</Text>
              <Text style={styles.cardDescription}>{evento.description}</Text>
                  <Text style={styles.cardDate}>Data: {formatDate(evento.date)}</Text>
              <Button
                buttonStyle={styles.buttonCard}
                title="Ver mais..."
                onPress={() => alert(`Entrar no evento: ${evento.title}`)}
              />
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Carregando eventos...</Text> // Exibe enquanto os eventos não estiverem carregados
        )}
      </ScrollView>
    </View>
  );
};


const Profile = () => {
  return (
    <View style={styles.container}>
      <Button
        buttonStyle={styles.buttonCard}
        title="Sair"
        onPress={() => alert('Sair')}
      />
    </View>
  );
};

// Scanner Component
const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const animateScanner = Animated.loop(
      Animated.sequence([
        Animated.timing(animation, { toValue: height - 40, duration: 2500, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 0, duration: 2000, useNativeDriver: true })
      ])
    );
    animateScanner.start();
    return () => animateScanner.stop();
  }, [animation]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    if (data.startsWith('https://')) {
      Linking.openURL(data);
    }
  };

  if (hasPermission === null) {
    return <Text>Permitir acesso à câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}>
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={[styles.focusedContainer, { width: width - 40 }]}>
            <View style={styles.unfocusedContent}></View>
            <View style={styles.focusArea}>
              <Animated.View style={[styles.animationLine, { transform: [{ translateY: animation }] }]} />
            </View>
            <View style={styles.unfocusedContent}></View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title={scanned ? 'Escanear novamente' : 'Escanear'} onPress={() => setScanned(false)} />
        </View>
      </Camera>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
},
scrollViewContainer: {
    paddingBottom: 20,
},
cardInicio: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 3,
    height: 380,
    width: '85%',
    maxWidth: 350,
    alignSelf: 'center',
    justifyContent: 'space-between',
},
cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
},
cardDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
},
cardDate: {
    marginTop: 10,
    fontSize: 12,
    color: '#555',
},
buttonCard: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
},
cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
},
emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
},
});

// Main Navigator Component
const Principal = () => {
  return (
    <Tab.Navigator initialRouteName='Feed' screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tab.Screen
        name="Feed"
        component={Inicio}
        options={({ navigation }) => ({
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (<MaterialIcons name="home" color={color} size={size} />),
          headerTitle: ""
        })}
      />
      <Tab.Screen
        name="Eventos"
        component={Eventos}
        options={{
          tabBarLabel: 'Eventos',
          tabBarIcon: ({ color, size }) => (<MaterialIcons name="event" color={color} size={size} />),
          headerTitle: "",
        }}
      />
      <Tab.Screen
        name="Leitor"
        component={Scanner}
        options={{
          tabBarLabel: 'Leitor de QrCode',
          tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="data-matrix-scan" color={color} size={size} />),
          headerTitle: "",
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={({ navigation }) => ({
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" color={color} size={size} />
          ),
          headerTitle: "",
          headerRight: () => (
            <MaterialIcons name="logout" onPress={() => navigation.navigate('Login')} size={26} color="#f00" />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default Principal;
