import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Reward, useRewards } from "../context/RewardsContext";
import { useTheme } from "../context/ThemeContext";

type RootStackParamList = {
  ProfileScreen: undefined;
  ProductsScreen: undefined;
  LoginScreen: undefined;
  RewardsScreen: undefined;
  SettingsScreen: undefined;
};

type RewardsScreenProps = NativeStackScreenProps<RootStackParamList, "RewardsScreen">;

export function RewardsScreen({ navigation }: RewardsScreenProps) {
  const { rewards, isLoading, loadError, reloadRewards } = useRewards();
  const { theme, colors } = useTheme();
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [redeemList, setRedeemList] = useState<Reward[]>([]);
  const lastRedeemTap = useRef<{ index: number; time: number } | null>(null);

  const totalRedeemPoints = useMemo(
    () => redeemList.reduce((sum, reward) => sum + reward.points, 0),
    [redeemList]
  );

  const addReward = (reward: Reward) => {
    setRedeemList((current) => [...current, reward]);
  };

  const handleRedeemItemPress = (index: number) => {
    const now = Date.now();
    const previousTap = lastRedeemTap.current;

    if (previousTap?.index === index && now - previousTap.time < 350) {
      setRedeemList((current) =>
        current.filter((_, itemIndex) => itemIndex !== index)
      );
      lastRedeemTap.current = null;
      return;
    }

    lastRedeemTap.current = { index, time: now };
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}> ← </Text>
          </Pressable>

          <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>

          <Pressable style={styles.cartToggle} onPress={() => setIsRedeemOpen((value) => !value)}>
            <Text style={styles.cartIcon}>🛒</Text>
          </Pressable>
        </View>

        <View style={[styles.progressBox, { backgroundColor: colors.subtleSurface }]}>
          <Text style={[styles.progressText, { color: colors.text }]}>Estas a 250 Pts de subir a nivel</Text>
          <View style={styles.progressBarWrap}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {isRedeemOpen && (
          <View style={[styles.redeemPanel, { backgroundColor: colors.subtleSurface }]}>
            <Text style={[styles.emptyRedeemText, { color: colors.mutedText }]}>
              Toca dos veces un premio para quitarlo
            </Text>
            {redeemList.length === 0 ? (
              <Text style={[styles.emptyRedeemText, { color: colors.text }]}>Aún no has elegido premios.</Text>
            ) : (
              redeemList.map((reward, index) => (
                <Pressable
                  key={`${reward.id}-${index}`}
                  style={[styles.redeemItem, { backgroundColor: colors.surfaceStrong }]}
                  onPress={() => handleRedeemItemPress(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toca dos veces para quitar ${reward.title} de tus premios`}
                >
                  <View style={styles.redeemInfo}>
                    <Text style={[styles.redeemTitle, { color: colors.text }]}>{reward.title}</Text>
                    <Text style={[styles.redeemValue, { color: colors.text }]}>
                      ${reward.value.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.pointsBadge}>
                    <Text style={styles.pointsText}>{reward.points} Pts.</Text>
                  </View>
                </Pressable>
              ))
            )}
            <Text style={[styles.redeemTotal, { color: colors.text }]}>
              Puntos para canjear: {totalRedeemPoints} Pts.
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {loadError ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.emptyRewardsText, { color: colors.error }]}>{loadError}</Text>
              <Pressable
                style={[styles.retryButton, { backgroundColor: colors.accent }]}
                onPress={() => void reloadRewards()}
                accessibilityRole="button"
              >
                <Text style={[styles.retryButtonText, { color: colors.accentText }]}>Reintentar</Text>
              </Pressable>
            </View>
          ) : isLoading ? (
            <Text style={[styles.emptyRewardsText, { color: colors.mutedText }]}>Cargando premios...</Text>
          ) : rewards.length === 0 ? (
            <Text style={[styles.emptyRewardsText, { color: colors.mutedText }]}>
              Aún no hay premios disponibles.
            </Text>
          ) : (
            rewards.map((reward) => (
              <Pressable
                key={reward.id}
                style={[styles.rewardCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => addReward(reward)}
                accessibilityRole="button"
                accessibilityLabel={`Agregar ${reward.title} a tus premios`}
              >
                <Text style={[styles.rewardTitle, { color: colors.text }]}>{reward.title}</Text>
                <Text style={[styles.rewardValue, { color: colors.text }]}>
                  ${reward.value.toLocaleString()}
                </Text>
                <Text style={[styles.rewardDescription, { color: colors.mutedText }]}>{reward.description}</Text>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>{reward.points} Pts.</Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        <View style={[styles.bottomTabs, { borderTopColor: colors.border }]}>
          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProfileScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Perfil</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProductsScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Productos</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("RewardsScreen")}>
            <Text style={[styles.tabTextActive, { color: colors.text }]}>Premios</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("SettingsScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Ajustes</Text>
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
    color: "#f2d5ff",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  cartToggle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#f2d9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  cartIcon: {
    fontSize: 18,
  },
  progressBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  progressText: {
    color: "#f5dcff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBarWrap: {
    height: 12,
    borderRadius: 20,
    backgroundColor: "#40204d",
    overflow: "hidden",
  },
  progressBar: {
    width: "70%",
    height: "100%",
    backgroundColor: "#d89ce8",
    borderRadius: 20,
  },
  redeemPanel: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
  },
  emptyRedeemText: {
    color: "#f5dcff",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 8,
  },
  redeemTotal: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 2,
  },
  redeemItem: {
    backgroundColor: "#5e1d68",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  redeemInfo: {
    flex: 1,
  },
  redeemTitle: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
  },
  redeemValue: {
    color: "#f5dcff",
    fontSize: 12,
    marginTop: 2,
  },
  pointsBadge: {
    backgroundColor: "#e7d86a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  pointsText: {
    color: "#3a2a0c",
    fontSize: 10,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  emptyRewardsText: {
    width: "100%",
    color: "#f2d5ff",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 24,
  },
  errorContainer: {
    width: "100%",
    alignItems: "center",
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
    width: "48%",
    backgroundColor: "#4a1a58",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  rewardTitle: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 32,
    marginBottom: 4,
  },
  rewardValue: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  rewardDescription: {
    color: "#e4c5ef",
    fontSize: 11,
    textAlign: "center",
    minHeight: 30,
    marginBottom: 8,
  },
  rewardBadge: {
    backgroundColor: "#e7d86a",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rewardBadgeText: {
    color: "#3a2a0c",
    fontSize: 10,
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