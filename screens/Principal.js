import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions, Linking, ScrollView, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { Button } from 'react-native-elements';
import axios from 'axios';
import Eventos from './Eventos';
import Profile from './Profile';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

const Feed = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Início!</Text>
    </View>
  );
};

const Inicio = () => {
  const [feed, setFeed] = useState([]);

  const fetchEventos = async () => {
    try {
      const response = await axios.get('http://192.168.0.110:3000/api/events');
      setFeed(response.data);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

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
                  style={styles.cardImage}
                  resizeMode="contain"
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
          <Text style={styles.emptyMessage}>Carregando eventos...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 200,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animation]);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    if (data.startsWith('https://')) {
      Linking.openURL(data);
    } else {
      alert(`Código escaneado: ${data}`);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão para acessar a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem permissão para acessar a câmera.</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.scanArea}>
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: animation }] },
              ]}
            />
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={scanned ? 'Escanear novamente' : 'Escanear'}
            onPress={() => setScanned(false)}
          />
        </View>
      </Camera>
    </View>
  );
};

const Principal = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarStyle: {
          height: 80, 
        },
        tabBarLabelStyle: {
          fontSize: 20, 
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Inicio}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" color={color} size={35} />,
          headerTitle: '',
        }}
      />
      <Tab.Screen
        name="Eventos"
        component={Eventos}
        options={{
          tabBarLabel: 'Eventos',
          tabBarIcon: ({ color }) => <MaterialIcons name="event" color={color} size={35} />,
          headerTitle: '',
        }}
      />
      <Tab.Screen
        name="Leitor"
        component={Scanner}
        options={{
          tabBarLabel: 'Scaner',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="data-matrix-scan" color={color} size={35} />,
          headerTitle: '',
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <MaterialIcons name="account-circle" color={color} size={35}/>,
          headerTitle: '',
        }}
      />
    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
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
    fontSize: 20,
    color: '#999',
    marginTop: 20,
  },
  profileIcon: {
    backgroundColor: 'gray',
    width: '40%',
    borderRadius: 100,
    alignSelf: 'center',
    marginTop: 30,
  },
  profileText: {
    paddingLeft: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 30,
    alignSelf: 'center',
    backgroundColor: 'red',
    width: '80%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
});

export default Principal;
