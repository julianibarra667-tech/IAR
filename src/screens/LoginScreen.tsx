
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type RootStackParamList = {
  LoginScreen: undefined;
  ProductsScreen: undefined;
};

type ExampleScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "LoginScreen"
>;

export function LoginScreen({ navigation }: ExampleScreenProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.card}>
        <Text style={styles.brand}>Malva</Text>

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresar usuario"
          placeholderTextColor="#a18bb8"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresar contraseña"
          placeholderTextColor="#a18bb8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Iniciar sesión" onPress={() => navigation.navigate("ProductsScreen")}
            color = "#5F0365"
        />

        <View style={styles.linksRow}>
          <Text style={styles.link}>Olvide mi contraseña</Text>
          <Text style={styles.link}>Olvide mi Usuario</Text>
        </View>

        <Text style={styles.terms}>Terminos y condiciones</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0213",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "rgba(62, 15, 77, 0.95)",
    borderRadius: 40,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  brand: {
    fontSize: 52,
    fontWeight: "700",
    color: "#f8d8ff",
    letterSpacing: 1,
    marginBottom: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
    overflow: "hidden",
    textShadowColor: "rgba(255,255,255,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  label: {
    alignSelf: "flex-start",
    color: "#f0d8ff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0edf1",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2b1b31",
    marginBottom: 8,
  },
  button: {
    width: "100%",
    backgroundColor: "#c460d9",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  linksRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  link: {
    color: "#f5d9ff",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  terms: {
    marginTop: 20,
    color: "#f5d9ff",
    fontSize: 12,
    textAlign: "center",
  },
});