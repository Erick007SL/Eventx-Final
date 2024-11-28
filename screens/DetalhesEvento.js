import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const DetalhesEvento = ({ route, navigation }) => {
  const [evento, setEvento] = useState(null);
  const { eventoId } = route.params; // Recebe o id do evento da navegação

  // Função para buscar os detalhes do evento
  useEffect(() => {
    const fetchEventoDetalhes = async () => {
      try {
        // Requisição para pegar os detalhes do evento usando o ID
        const response = await axios.get(`http://192.168.0.110:3000/api/events/${eventoId}`);
        // const response = await axios.get(`http://20.9.130.209:3000/api/events/${eventoId}`);
        setEvento(response.data);
      } catch (error) {
        console.error('Erro ao buscar os detalhes do evento:', error);
      }
    };

    fetchEventoDetalhes();
  }, [eventoId]); // Quando o eventoId mudar, refaz a requisição

  // Exibe "Carregando..." enquanto o evento não for carregado
  if (!evento) {
    return (
      <View style={styles.container}>
        <Text>Carregando detalhes do evento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{evento.title}</Text>
      <Text style={styles.description}>{evento.description}</Text>
      <Text style={styles.date}>Data: {evento.date}</Text>


      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    marginBottom: 20,
  },
});

export default DetalhesEvento;
