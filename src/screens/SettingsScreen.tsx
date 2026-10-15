import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ThemeName, useTheme } from "../context/ThemeContext";

type RootStackParamList = {
  ProfileScreen: undefined;
  ProductsScreen: undefined;
  LoginScreen: undefined;
  ProductConfigScreen: undefined;
  RewardConfigScreen: undefined;
  SettingsScreen: undefined;
  RewardsScreen: undefined;
};

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, "SettingsScreen">;

const menuItems = [
  { label: "Analisis", enabled: true },
  { label: "Tema", enabled: true },
  { label: "Conf. Puntos", enabled: true },
  { label: "Usuarios", enabled: true },
  { label: "Conf. Premios", enabled: true },
  { label: "Conf. Productos", enabled: true },
  { label: "Eliminar Cuenta", enabled: true },
  { label: "Terminos y Condiciones", enabled: false },
  { label: "Ayuda/ PQRS", enabled: false },
];

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme, colors, isLoading: isThemeLoading, syncError, changeTheme } = useTheme();

  const handleThemeChange = (nextTheme: ThemeName) => {
    if (nextTheme === theme) {
      return;
    }

    void changeTheme(nextTheme).catch((error: unknown) => {
      Alert.alert(
        "No se pudo cambiar el tema",
        error instanceof Error ? error.message : "No se pudo guardar el tema."
      );
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>

          <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Cerrar Sesion</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>
        {syncError ? (
          <Text style={[styles.themeError, { color: colors.error }]}>{syncError}</Text>
        ) : null}

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <Pressable
              key={`${item.label}-${index}`}
              style={[
                styles.row,
                { backgroundColor: colors.subtleSurface },
                !item.enabled && styles.disabledRow,
              ]}
              onPress={() => {
                if (item.label === "Conf. Productos") {
                  navigation.navigate("ProductConfigScreen");
                } else if (item.label === "Conf. Premios") {
                  navigation.navigate("RewardConfigScreen");
                } else if (item.label === "Tema") {
                  Alert.alert("Elegir tema", "Selecciona la apariencia de la aplicación.", [
                    {
                      text: "Oscuro",
                      onPress: () => handleThemeChange("dark"),
                    },
                    {
                      text: "Claro",
                      onPress: () => handleThemeChange("light"),
                    },
                    { text: "Cancelar", style: "cancel" },
                  ]);
                }
              }}
              accessibilityRole="button"
              disabled={!item.enabled || (item.label === "Tema" && isThemeLoading)}
            >
              <Text style={[styles.rowText, { color: colors.text }, !item.enabled && styles.disabledText]}>
                {item.label === "Tema"
                  ? `Tema · ${isThemeLoading ? "Cargando..." : theme === "dark" ? "Oscuro" : "Claro"}`
                  : item.label}
              </Text>
              {item.enabled && (
                <View
                  style={[
                    styles.toggle,
                    item.label === "Tema"
                      ? { backgroundColor: theme === "dark" ? "#51405a" : "#f0c957" }
                      : { backgroundColor: colors.text },
                  ]}
                />
              )}
            </Pressable>
          ))}
        </ScrollView>

        <Pressable style={[styles.scanButton, { backgroundColor: colors.accent }]}>
          <Text style={styles.scanButtonText}>Escanear QR</Text>
        </Pressable>

        <View style={styles.bottomTabs}>
          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProfileScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Perfil</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProductsScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Productos</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("RewardsScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Premios</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("SettingsScreen")}>
            <Text style={[styles.tabTextActive, { color: colors.text }]}>Ajustes</Text>
          </Pressable>
        </View>
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
  },
  phoneShell: {
    width: 380,
    maxWidth: "92%",
    height: 760,
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
    marginBottom: 10,
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
  brand: {
    flex: 1,
    textAlign: "center",
    fontSize: 44,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 10,
    marginHorizontal: 10,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  closeText: {
    flex: 1,
    textAlign: "center",
    color: "#f2d5ff",
    fontSize: 14,
    fontWeight: "700",
  },
  sessionIcon: {
    width: 24,
    height: 24,
    borderRadius: 10,
    backgroundColor: "#f1d9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionText: {
    color: "#4a0f51",
    fontSize: 9,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#f7d8ff",
    textAlign: "center",
    marginBottom: 10,
  },
  themeError: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
  list: {
    maxHeight: 430,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 8,
  },
  disabledRow: {
    opacity: 0.45,
  },
  rowText: {
    color: "#f5dcff",
    fontSize: 19,
    fontWeight: "700",
    flex: 1,
  },
  disabledText: {
    color: "#f5dcff",
  },
  toggle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f5dcff",
  },
  scanButton: {
    backgroundColor: "#d89ce8",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 12,
    marginTop: "auto",
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tabText: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.85,
  },
  tabTextActive: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
  },
});