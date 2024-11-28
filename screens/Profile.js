import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, Modal, TouchableOpacity, Animated, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    name: 'Erick Lima',
    email: 'erick@gmail.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
  });
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false); 

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleConfirmRating = () => {
    Alert.alert('Obrigado pela sua Avaliação!', 'Otneve agradece sua avaliação.', [
      {
        text: 'OK',
        onPress: () => {
          setIsRated(true);
          setTimeout(() => {
            setIsRated(false);
            setRating(0); 
          }, 3000); 
        },
      },
    ]);
    setRatingModalVisible(false);
  };

  const handleCancelRating = () => {
    setRating(0); // Resetando o rating
    setRatingModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userInfo.profilePicture }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userInfo.name}</Text>
        <Text style={styles.profileEmail}>{userInfo.email}</Text>
      </View>

      <View style={styles.versionCard}>
        <Text style={styles.versionCardTitle}>Versão do App</Text>
        <Text style={styles.versionText}>1.0.2</Text>
      </View>

      <Animated.View style={[styles.card, styles.cardGray]}>
        <TouchableOpacity style={styles.optionButton} onPress={() => setRatingModalVisible(true)}>
          <Text style={styles.optionText}>Avalie o App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Fale Conosco</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setLogoutModalVisible(true)}
        >
          <Text style={styles.optionText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isRatingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Avalie o App</Text>
            <AirbnbRating
              count={5}
              defaultRating={rating}
              size={30}
              onFinishRating={handleRating}
              showRating={false}
              isDisabled={isRated} // Desabilita as estrelas após a avaliação
              starContainerStyle={{ marginBottom: 20 }}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, styles.modalButton]}
                onPress={handleCancelRating}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, styles.modalButton]}
                onPress={handleConfirmRating}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Você tem certeza?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelButton, styles.modalButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmButton, styles.modalButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#888',
  },
  versionCard: {
    width: '100%',
    height: 100,
    backgroundColor: '#007BFF',
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  versionCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  versionText: {
    fontSize: 24,
    color: '#fff',
  },
  card: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardGray: {
    backgroundColor: '#007BFF',
  },
  optionButton: {
    width: '80%',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1463b8',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    width: '45%',
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalCancelButton: {
    backgroundColor: 'red',
  },
  modalConfirmButton: {
    backgroundColor: 'green',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default Profile;
