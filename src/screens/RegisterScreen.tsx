import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { register } from "../services/auth.service";
import type { RootStackParamList } from "../navigation/types";

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RegisterScreen"
>;

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme, colors } = useTheme();

  const handleRegister = async () => {
    const parsedAge = Number(age);

    if (!name.trim() || !lastName.trim() || !age.trim() || !username.trim() || !password) {
      Alert.alert("Datos incompletos", "Completa todos los campos para continuar.");
      return;
    }

    if (parsedAge >= 1 && parsedAge <= 17) {
      Alert.alert("Edad insuficiente", "Debes ser mayor de edad para registrarte.");
      return;
    }

    if (!Number.isInteger(parsedAge) || parsedAge < 18 || parsedAge > 120) {
      Alert.alert("Edad no válida", "Ingresa una edad válida.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username.trim())) {
      Alert.alert(
        "Usuario no válido",
        "Usa entre 3 y 30 letras, números, puntos, guiones o guiones bajos."
      );
      return;
    }

    if (password.length < 8) {
      Alert.alert("Contraseña no válida", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        username: username.trim(),
        password,
        name: name.trim(),
        lastName: lastName.trim(),
        age: parsedAge,
      });
      Alert.alert("Cuenta creada", "El registro se completó correctamente.", [
        {
          text: "Aceptar",
          onPress: () => navigation.navigate("LoginScreen"),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo conectar con el servidor.";

      Alert.alert("No se pudo crear la cuenta", message);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Crear cuenta</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>Regístrate para comenzar</Text>

          <Text style={[styles.label, { color: colors.label }]}>Usuario</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Crea un nombre de usuario"
            placeholderTextColor="#a18bb8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            accessibilityLabel="Nombre de usuario"
          />

          <Text style={[styles.label, { color: colors.label }]}>Contraseña</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#a18bb8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="next"
            accessibilityLabel="Contraseña"
          />

          <Text style={[styles.label, { color: colors.label }]}>Nombre</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#a18bb8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Nombre"
          />

          <Text style={[styles.label, { color: colors.label }]}>Apellido</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ingresa tu apellido"
            placeholderTextColor="#a18bb8"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            returnKeyType="next"
            accessibilityLabel="Apellido"
          />

          <Text style={[styles.label, { color: colors.label }]}>Edad</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ingresa tu edad"
            placeholderTextColor="#a18bb8"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            returnKeyType="done"
            accessibilityLabel="Edad"
          />

          <Pressable
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("LoginScreen")}
            accessibilityRole="button"
          >
            <Text style={[styles.loginLink, { color: colors.text }]}>¿Ya tienes cuenta? Inicia sesión</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050207",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  phoneShell: {
    width: 380,
    maxWidth: "92%",
    height: "94%",
    maxHeight: 760,
    backgroundColor: "#2a0f2f",
    borderRadius: 42,
    paddingVertical: 18,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 15,
    borderWidth: 4,
    borderColor: "#9b8ca1",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: "#4a0f51",
    fontSize: 28,
    fontWeight: "700",
  },
  headerTitle: {
    color: "#f2d5ff",
    fontSize: 16,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 42,
  },
  formContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  brand: {
    alignSelf: "center",
    fontSize: 46,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 10,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    color: "#f2d5ff",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 14,
  },
  label: {
    alignSelf: "flex-start",
    color: "#f0d8ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 6,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0edf1",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: "#2b1b31",
    marginBottom: 5,
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#5F0365",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  loginLink: {
    marginTop: 18,
    color: "#f5d9ff",
    fontSize: 13,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
