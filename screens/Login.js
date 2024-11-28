import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import styles from "../style/MainStyle"; // Verifique se esse caminho está correto

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);

  const validar = () => {
    let error = false;
    setErrorEmail(null);
    setErrorPassword(null);

    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!re.test(String(email).toLowerCase())) {
      setErrorEmail("Preencha seu E-mail corretamente");
      error = true;
    }
    if (!password) {
      setErrorPassword("Por favor, insira sua senha");
      error = true;
    }

    return !error;
  };

  const entrar = async () => {
    if (validar()) {
      try {
        const response = await axios.post('http://192.168.0.110:3000/api/users/login', {
        // const response = await axios.post('http://20.9.130.209:3000/api/users/login', {
          email: email,
          password: password,
        });

        console.log(response.data); // Verifique a resposta do servidor

        if (response.data && response.data.userId) {
          // Verifica se userId está presente na resposta
          console.log("Login realizado com sucesso! Navegando para a tela Principal...");
          navigation.navigate("Principal"); // Navega para a tela Principal
        } else {
          // Se o userId não existir, considere como falha de login
          alert("Login falhou: " + (response.data.message || "Erro desconhecido"));
        }
      } catch (error) {
        // Tratamento de erros na requisição
        if (error.response) {
          alert("Erro ao fazer login: " + (error.response.data.message || 'Erro desconhecido'));
        } else if (error.request) {
          alert("Erro ao fazer login: Não houve resposta do servidor.");
        } else {
          alert("Erro ao fazer login: " + error.message);
        }
        console.error(error);
      }
    }
  };


  const irParaCadastro = () => {
    navigation.navigate("Cadastro");
  };

  return (
    <View style={[styles.container, specificStyle.container]}>
      <Text style={specificStyle.logo}>
        Otnev<Text style={{ color: "blue" }}>e</Text>
      </Text>
      <Text style={specificStyle.span}> Seja bem-vindo ao nosso App, Otneve agradece a sua preferência. </Text>

      <Input style={specificStyle.input}
        placeholder="E-mail: "
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(value) => {
          setEmail(value);
          setErrorEmail(null);
        }}
        keyboardType="email-address"
        errorMessage={errorEmail}
      />

      <Input style={specificStyle.input}
        placeholder="Senha: "
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={(value) => {
          setPassword(value);
          setErrorPassword(null);
        }}
        secureTextEntry={true}
        errorMessage={errorPassword}
      />

      <View style={styles.botoes}>
        <Button
          title="Entrar"
          onPress={entrar}
        />
      </View>

      <View style={specificStyle.container}>
        <View style={specificStyle.textRow}>
          <Text style={specificStyle.textCadastro}>
            Não possui cadastro?{' '}
          </Text>
          <TouchableOpacity onPress={irParaCadastro}>
            <Text style={specificStyle.link}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const specificStyle = StyleSheet.create({
  container: {
    paddingTop: 160,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCadastro: {
    paddingBottom: 135,
    fontSize: 18,
  },
  link: {
    paddingBottom: 135,
    color: 'blue',
    fontSize: 18,
  },
  logo: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 60,
  },
  span: {
    marginBottom: 50,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#858585',
  },
});
