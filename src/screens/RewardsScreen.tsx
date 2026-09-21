import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type RootStackParamList = {
  ProfileScreen: undefined;
  ProductsScreen: undefined;
  LoginScreen: undefined;
  RewardsScreen: undefined;
  SettingsScreen: undefined;
};

type Reward = {
  id: number;
  title: string;
  value: number;
  points: number;
  description: string;
};

type RewardsScreenProps = NativeStackScreenProps<RootStackParamList, "RewardsScreen">;

const rewards: Reward[] = [
  { id: 1, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
  { id: 2, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
  { id: 3, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
  { id: 4, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
  { id: 5, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
  { id: 6, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
];

export function RewardsScreen({ navigation }: RewardsScreenProps) {
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [redeemList, setRedeemList] = useState<Reward[]>([
    { id: 1, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
    { id: 2, title: "Cupón de $20.000 en tu compra", value: 20000, points: 100, description: "Próximamente" },
  ]);

  const totalRedeemPoints = useMemo(
    () => redeemList.reduce((sum, reward) => sum + reward.points, 0),
    [redeemList]
  );

  const addReward = (reward: Reward) => {
    setRedeemList((current) => [...current, reward]);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.phoneShell}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}> ← </Text>
          </Pressable>

          <Text style={styles.brand}>Malva</Text>

          <Pressable style={styles.cartToggle} onPress={() => setIsRedeemOpen((value) => !value)}>
            <Text style={styles.cartIcon}>🛒</Text>
          </Pressable>
        </View>

        <View style={styles.progressBox}>
          <Text style={styles.progressText}>Estas a 250 Pts de subir a nivel</Text>
          <View style={styles.progressBarWrap}>
            <View style={styles.progressBar} />
          </View>
        </View>

        {isRedeemOpen && (
          <View style={styles.redeemPanel}>
            {redeemList.map((reward, index) => (
              <View key={`${reward.title}-${index}`} style={styles.redeemItem}>
                <View style={styles.redeemInfo}>
                  <Text style={styles.redeemTitle}>{reward.title}</Text>
                  <Text style={styles.redeemValue}>${reward.value.toLocaleString()}</Text>
                </View>

                <View style={styles.pointsBadge}>
                  <Text style={styles.pointsText}>{reward.points} Pts.</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {rewards.map((reward) => (
            <Pressable key={reward.id} style={styles.rewardCard} onPress={() => addReward(reward)}>
              <Text style={styles.rewardTitle}>{reward.title}</Text>
              <Text style={styles.rewardValue}>${reward.value.toLocaleString()}</Text>
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardBadgeText}>{reward.points} Pts.</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.bottomTabs}>
          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProfileScreen")}>
            <Text style={styles.tabText}>Perfil</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProductsScreen")}>
            <Text style={styles.tabText}>Productos</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("RewardsScreen")}>
            <Text style={styles.tabTextActive}>Premios</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("SettingsScreen")}>
            <Text style={styles.tabText}>Ajustes</Text>
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