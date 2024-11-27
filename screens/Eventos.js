import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Button, Image, StyleSheet } from 'react-native';

const Eventos = ({ navigation }) => {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        fetch('http://20.9.130.209:3000/api/events')
            .then((response) => response.json())
            .then((data) => setEventos(data))
            .catch((error) => console.error('Erro ao carregar eventos:', error));
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {eventos.length > 0 ? (
                    eventos.map((evento) => (
                        <View key={evento.id} style={styles.cardInicio}>
                            {evento.coverImage && (
                                <Image
                                    source={{ uri: `http://20.9.130.209:3000/uploads/${evento.coverImage}` }}
                                    style={styles.cardImage} resizeMode='contain'
                                />
                            )}
                            <Text style={styles.cardTitle}>{evento.title}</Text>
                            <Text style={styles.cardDescription}>{evento.description}</Text>
                            <Text style={styles.cardDate}>Data: {formatDate(evento.date)}</Text>
                            <Button ButtonStyle={styles.buttonCard}
                                title="Ver mais..."
                                onPress={() => navigation.navigate('DetalhesEvento', { eventoId: evento.id })}
                            />
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyMessage}>Nenhum evento encontrado</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgray',
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

export default Eventos;
