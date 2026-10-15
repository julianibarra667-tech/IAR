
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/auth.service";
import type { RootStackParamList } from "../navigation/types";

type ExampleScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "LoginScreen"
>;

export function LoginScreen({ navigation }: ExampleScreenProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, colors } = useTheme();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!usuario.trim() || !password) {
      Alert.alert("Datos incompletos", "Ingresa tu usuario y contraseña.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ username: usuario.trim(), password });
      signIn(result.user);
      navigation.navigate("ProfileScreen");
    } catch (error) {
      Alert.alert(
        "No se pudo iniciar sesión",
        error instanceof Error ? error.message : "Ocurrió un error inesperado."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.screen }]}>
      <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

      <View style={[styles.card, { backgroundColor: colors.shell }]}>
        <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>

        <Text style={[styles.label, { color: colors.label }]}>Usuario</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
          placeholder="Ingresar usuario"
          placeholderTextColor="#a18bb8"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Nombre de usuario"
        />

        <Text style={[styles.label, { color: colors.label }]}>Contraseña</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
          placeholder="Ingresar contraseña"
          placeholderTextColor="#a18bb8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          accessibilityLabel="Contraseña"
        />

        <View style={styles.buttonsRow}>
          <Pressable
            style={[styles.button, styles.firstButton]}
            onPress={handleLogin}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondButton]}
            onPress={() => navigation.navigate("RegisterScreen")}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Crear cuenta</Text>
          </Pressable>

        </View>


         <Pressable  onPress={() => navigation.navigate("TermsScreen")}>
              <Text style={[styles.link, { color: colors.text }]}>Olvide mi contraseña</Text>
        </Pressable>

         <Pressable  onPress={() => navigation.navigate("TermsScreen")}>
              <Text style={[styles.link, { color: colors.text }]}>Olvide mi Usuario</Text>
        </Pressable>

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
    flex: 1,
    backgroundColor: "#5F0365",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  buttonsRow: {
    width: "100%",
    flexDirection: "row",
  },
  firstButton: {
    marginRight: 6,
  },
  secondButton: {
    marginLeft: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  linksRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  link: {
    marginTop: 10,
    color: "#f5d9ff",
    fontSize: 12,
    textDecorationLine: "underline",
  },
  terms: {
    marginTop: 20,
    color: "#f5d9ff",
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline"
  },
});