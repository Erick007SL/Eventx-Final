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
            const response = await axios.post('http://192.168.0.113:3000/api/users/login', {
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
      <Text style={specificStyle.logo} h1>
        Event<Text style={{ color: "blue" }} h3>X</Text>
      </Text>
      <Input
        placeholder="E-mail: "
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(value) => {
          setEmail(value);
          setErrorEmail(null);
        }}
        keyboardType="email-address"
        errorMessage={errorEmail}
      />

      <Input
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
    paddingTop: 40,
    flex: 1, // Adicionado para garantir que a tela ocupe todo o espaço disponível
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center', // Centraliza horizontalmente
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCadastro: {
    fontSize: 18,
  },
  link: {
    color: 'blue',
    fontSize: 18,
  },
  logo: {
    marginBottom: 20, // Ajuste a margem conforme necessário
    textAlign: 'center', // Centraliza o texto do logo
  },
});
