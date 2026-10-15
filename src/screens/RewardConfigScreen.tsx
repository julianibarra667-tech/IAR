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
import { Reward, useRewards } from "../context/RewardsContext";
import { useTheme } from "../context/ThemeContext";
import { createReward, deleteReward } from "../services/reward.service";

type RootStackParamList = {
  RewardConfigScreen: undefined;
  SettingsScreen: undefined;
};

type RewardConfigScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RewardConfigScreen"
>;

export function RewardConfigScreen({ navigation }: RewardConfigScreenProps) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingRewardId, setDeletingRewardId] = useState<string | null>(null);
  const { theme, colors } = useTheme();
  const {
    rewards,
    isLoading,
    loadError,
    addReward,
    removeReward,
    reloadRewards,
  } = useRewards();

  const handleAddReward = async () => {
    const parsedValue = Number(value);
    const parsedPoints = Number(points);

    if (!title.trim() || !value.trim() || !points.trim() || !description.trim()) {
      Alert.alert("Datos incompletos", "Completa todos los campos del premio.");
      return;
    }

    if (
      !Number.isFinite(parsedValue) ||
      parsedValue <= 0 ||
      !Number.isInteger(parsedPoints) ||
      parsedPoints <= 0
    ) {
      Alert.alert(
        "Datos no válidos",
        "Ingresa un valor mayor a cero y una cantidad válida de puntos."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const reward = await createReward({
        title: title.trim(),
        value: parsedValue,
        points: parsedPoints,
        description: description.trim(),
      });
      addReward(reward);
      setTitle("");
      setValue("");
      setPoints("");
      setDescription("");
      Alert.alert("Premio agregado", "El premio se creó correctamente.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo conectar con la API de premios.";
      Alert.alert("No se pudo agregar el premio", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteReward = async (reward: Reward) => {
    setDeletingRewardId(reward.id);
    try {
      await deleteReward(reward.id);
      removeReward(reward.id);
      Alert.alert("Premio eliminado", `${reward.title} se eliminó correctamente.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo conectar con la API de premios.";
      Alert.alert("No se pudo eliminar el premio", message);
    } finally {
      setDeletingRewardId(null);
    }
  };

  const handleDeleteReward = (reward: Reward) => {
    Alert.alert(
      "Eliminar premio",
      `¿Seguro que deseas eliminar "${reward.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            void confirmDeleteReward(reward);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Volver a ajustes"
          >
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Configurar premios</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Crea y administra los premios del catálogo</Text>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.label, { color: colors.label }]}>Nombre del premio</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ej. Cupón de descuento"
            placeholderTextColor="#a18bb8"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
            returnKeyType="next"
            accessibilityLabel="Nombre del premio"
          />

          <Text style={[styles.label, { color: colors.label }]}>Valor del premio</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ej. 20000"
            placeholderTextColor="#a18bb8"
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            returnKeyType="next"
            accessibilityLabel="Valor del premio"
          />

          <Text style={[styles.label, { color: colors.label }]}>Puntos necesarios</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Ej. 100"
            placeholderTextColor="#a18bb8"
            value={points}
            onChangeText={setPoints}
            keyboardType="number-pad"
            returnKeyType="next"
            accessibilityLabel="Puntos necesarios"
          />

          <Text style={[styles.label, { color: colors.label }]}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput, { backgroundColor: colors.input, color: colors.inputText }]}
            placeholder="Describe brevemente el premio"
            placeholderTextColor="#a18bb8"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Descripción del premio"
          />

          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: colors.accent },
              (isSubmitting || isLoading) && styles.disabledButton,
            ]}
            onPress={handleAddReward}
            disabled={isSubmitting || isLoading}
            accessibilityRole="button"
          >
            <Text style={[styles.actionButtonText, { color: colors.accentText }]}>
              {isLoading
                ? "Cargando premios..."
                : isSubmitting
                  ? "Guardando..."
                  : "Agregar premio"}
            </Text>
          </Pressable>

          <Text style={[styles.listTitle, { color: colors.text }]}>Premios creados</Text>
          {loadError ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.error }]}>{loadError}</Text>
              <Pressable
                style={[styles.retryButton, { backgroundColor: colors.accent }]}
                onPress={() => void reloadRewards()}
                accessibilityRole="button"
              >
                <Text style={[styles.retryButtonText, { color: colors.accentText }]}>Reintentar</Text>
              </Pressable>
            </View>
          ) : isLoading ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>Cargando premios...</Text>
          ) : rewards.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>Aún no has agregado premios.</Text>
          ) : (
            rewards.map((reward) => (
              <View key={reward.id} style={[styles.rewardCard, { backgroundColor: colors.subtleSurface }]}>
                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardTitle, { color: colors.text }]}>{reward.title}</Text>
                  <Text style={[styles.rewardDetails, { color: colors.mutedText }]}>
                    ${reward.value.toLocaleString()} · {reward.points} puntos
                  </Text>
                  <Text style={[styles.rewardDescription, { color: colors.mutedText }]}>{reward.description}</Text>
                </View>
                <Pressable
                  style={[
                    styles.deleteButton,
                    deletingRewardId === reward.id && styles.disabledButton,
                  ]}
                  onPress={() => handleDeleteReward(reward)}
                  disabled={deletingRewardId !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${reward.title}`}
                >
                  <Text style={styles.deleteButtonText}>
                    {deletingRewardId === reward.id ? "..." : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            ))
          )}
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
  },
  phoneShell: {
    width: 380,
    maxWidth: "92%",
    height: 760,
    maxHeight: "96%",
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
    marginBottom: 12,
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
    fontSize: 38,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 7,
    marginHorizontal: 12,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerSpacer: {
    width: 42,
  },
  title: {
    color: "#f7d8ff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    color: "#f2d5ff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  label: {
    alignSelf: "flex-start",
    color: "#f0d8ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 7,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0edf1",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2b1b31",
  },
  descriptionInput: {
    minHeight: 76,
  },
  actionButton: {
    backgroundColor: "#5f0365",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.65,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  listTitle: {
    color: "#f7d8ff",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 10,
  },
  emptyText: {
    color: "#f2d5ff",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  errorText: {
    color: "#ffd4dc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#5f0365",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    color: "#f5dcff",
    fontSize: 16,
    fontWeight: "700",
  },
  rewardDetails: {
    color: "#e4c5ef",
    fontSize: 14,
    marginTop: 4,
  },
  rewardDescription: {
    color: "#e4c5ef",
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#8b2441",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
