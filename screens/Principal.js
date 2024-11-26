import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions, Linking, ScrollView, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from 'react-native-elements';
import axios from 'axios';

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

const Eventos = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);

  // Função para buscar eventos
  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://192.168.0.113:3000/api/events');
      setEventos(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {eventos.length > 0 ? (
          eventos.map((evento) => (
            <View key={evento.id} style={styles.cardInicio}>
              <Text style={styles.cardTitle}>{evento.title}</Text>
              <Text style={styles.cardDescription}>{evento.description}</Text>
              
              {/* Exibindo a data do evento */}
              <Text style={styles.cardDate}>Data:{formatDate(evento.date)}</Text>
              
              
              
              <Button
                title="Ver mais..."
                onPress={() => navigation.navigate('DetalhesEvento', { eventoId: evento.id })} // Passando o eventoId para a próxima tela
              />
            </View>
          ))
        ) : (
          <Text>Carregando eventos...</Text>
        )}
      </ScrollView>
    </View>
  );
};
// Início Component
const Inicio = () => {
  // Estado para armazenar os eventos
  const [feed, setFeed] = useState([]);

  // Função para buscar os eventos da API usando axios
  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://192.168.0.113:3000/api/events'); // Substitua pela URL da sua API
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
              <Text style={styles.cardTitle}>{evento.title}</Text>
              {/* Exibe a descrição do evento */}
              <Text style={styles.cardDescription}>{evento.description}</Text>
              <Button
                buttonStyle={styles.buttonCard}
                title="Ver mais..."
                onPress={() => alert(`Entrar no evento: ${evento.title}`)}
              />
            </View>
          ))
        ) : (
          <Text>Carregando eventos...</Text> // Exibe enquanto os eventos não estiverem carregados
        )}
      </ScrollView>
    </View>
  );
};// Profile Component
const Profile = () => {
  return (
    <View style={styles.container}>
      <Text>Perfil da pessoa!</Text>
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
    padding: 15,  // Aumenta o espaçamento interno para dar um pouco mais de área
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 3,
    width: '80%',  // Define a largura do card para 80% da tela
    maxWidth: 350, // Limita a largura máxima do card
    alignSelf: 'center', // Centraliza o card horizontalmente
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
  buttonCard: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
  },

  camera: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  focusedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unfocusedContent: {
    flex: 1,
  },
  focusArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  animationLine: {
    height: 2,
    width: '100%',
    backgroundColor: 'red'
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    padding: 10,
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
          tabBarIcon: ({ color, size }) => (<MaterialIcons name="account-circle" color={color} size={size} />),
          headerTitle: "",
        })}
      />
    </Tab.Navigator>
  );
};

export default Principal;
