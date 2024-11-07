import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, CheckBox, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import styles from "../style/MainStyle";
import { useNavigation } from "@react-navigation/native";

export default function Cadastro() {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);
  const [nome, setNome] = useState(null);
  const [senha, setSenha] = useState(null);
  const [confirmarSenha, setConfirmarSenha] = useState(null);
  const [isSelected, setisSelected] = useState(false);
  const [erroremail, setErrorEmail] = useState(null);
  const [errornome, setErrorNome] = useState(null);
  const [errorsenha, setErrorSenha] = useState(null);
  const [errorConfirmarSenha, setErrorConfirmarSenha] = useState(null);

  const validar = () => {
    let error = false;
    setErrorEmail(null);
    setErrorNome(null);
    setErrorSenha(null);
    setErrorConfirmarSenha(null);

    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!re.test(String(email).toLowerCase())) {
      setErrorEmail("Preencha seu E-mail corretamente");
      error = true;
    }
    if (!nome) {
      setErrorNome("Por favor, insira seu nome");
      error = true;
    }
    if (!senha) {
      setErrorSenha("Por favor, insira uma senha");
      error = true;
    }
    if (senha !== confirmarSenha) {
      setErrorConfirmarSenha("As senhas não coincidem");
      error = true;
    }

    return !error;
  };

  const salvar = async () => {
    if (validar()) {
      try {
        const response = await axios.post('http://192.168.0.113:3000/api/users/register', {
          username: nome,
          email: email,
          password: senha,
        });

        alert("Cadastrado com sucesso!");
        navigation.navigate("Login");
      } catch (error) {
        if (error.response) {
          alert("Erro ao cadastrar: " + (error.response.data.message || 'Erro desconhecido'));
        } else if (error.request) {
          alert("Erro ao cadastrar: Não houve resposta do servidor.");
        } else {
          alert("Erro ao cadastrar: " + error.message);
        }
        console.error(error);
      }
    }
  };

  return (
    <View style={[styles.container, specificStyle.specificContainer]}>
      <Text style={specificStyle.Text} h3>
        Cadastre-se
      </Text>

      <Input
        placeholder="Nome: "
        onChangeText={(value) => setNome(value)}
        errorMessage={errornome}
      />
      <Input
        placeholder="E-mail: "
        onChangeText={(value) => {
          setEmail(value);
          setErrorEmail(null);
        }}
        keyboardType="email-address"
        errorMessage={erroremail}
      />
      <Input
        placeholder="Senha:"
        onChangeText={(value) => {
          setSenha(value);
          setErrorSenha(null);
        }}
        secureTextEntry
        errorMessage={errorsenha}
      />
      <Input
        placeholder="Confirme sua Senha:"
        onChangeText={(value) => {
          setConfirmarSenha(value);
          setErrorConfirmarSenha(null);
        }}
        secureTextEntry
        errorMessage={errorConfirmarSenha}
      />
    
      <CheckBox
        title="Aceito os termos de uso"
        checkedIcon="check"
        uncheckedIcon="square-o"
        checkedColor="blue"
        uncheckedColor="red"
        checked={isSelected}
        onPress={() => setisSelected(!isSelected)}
      />

      <Button
        icon={<Icon name="check" size={15} color="white" />}
        title="Salvar"
        buttonStyle={specificStyle.button}
        onPress={salvar}
      />
    </View>
  );
}

const specificStyle = StyleSheet.create({
  Text: {
    position: "relative",
    bottom: 100,
  },
  button: {
    width: 120,
    marginTop: 20,
  },
});
