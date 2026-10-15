import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ProfileCard } from "../components/ProfileCard";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../navigation/types";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "ProfileScreen">;

function getLevelProgress(points: number) {
  if (points >= 1000) {
    return { progress: 100, progressText: `${points.toLocaleString()} EXP` };
  }

  const levelStart = points >= 500 ? 500 : points >= 200 ? 200 : 0;
  const levelEnd = points >= 500 ? 1000 : points >= 200 ? 500 : 200;
  const pointsInLevel = points - levelStart;
  const pointsForLevel = levelEnd - levelStart;

  return {
    progress: (pointsInLevel / pointsForLevel) * 100,
    progressText: `${pointsInLevel} / ${pointsForLevel} EXP`,
  };
}

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme, colors } = useTheme();
  const { user, signOut } = useAuth();
  const levelProgress = getLevelProgress(user?.points ?? 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.screen }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={[styles.phoneShell, { backgroundColor: colors.shell, borderColor: colors.border }]}>
        <View style={styles.topBar}>
          <Pressable
            style={styles.tabButton}
            onPress={() => {
              signOut();
              navigation.navigate("LoginScreen");
            }}
          >
            <Text style={[styles.tabText, { color: colors.text }]}>Cerrar Sesion</Text>
          </Pressable>

          <Pressable style={styles.logoutButton}>
            <Text style={styles.logoutIcon}>?</Text>
          </Pressable>
        </View>

        <Text style={[styles.brand, { color: colors.text }]}>Malva</Text>

        {user ? (
          <ProfileCard
            name={user.name}
            lastName={user.lastName}
            email={`@${user.username}`}
            createdAt={new Date(user.createdAt).toLocaleDateString()}
            level={user.level}
            points={user.points}
            progress={levelProgress.progress}
            progressText={levelProgress.progressText}
          />
        ) : (
          <Text style={[styles.emptyProfile, { color: colors.mutedText }]}>
            Inicia sesión para ver tu perfil.
          </Text>
        )}

        <View style={[styles.bottomTabs, { borderTopColor: colors.border }]}>
          <Pressable
            style={styles.tabButton}
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <Text style={[styles.tabTextActive, { color: colors.text }]}>Perfil</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("ProductsScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Productos</Text>
          </Pressable>

          <Pressable style={styles.tabButton} onPress={() => navigation.navigate("RewardsScreen")}>
            <Text style={[styles.tabText, { color: colors.text }]}>Premios</Text>
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
  closeText: {
    color: "#f2d5ff",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  logoutButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#f2d9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    fontSize: 12,
    color: "#4a0f51",
  },
  brand: {
    textAlign: "center",
    fontSize: 46,
    fontWeight: "700",
    color: "#f5d8ff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 40,
    marginBottom: 18,
    textShadowColor: "rgba(255,255,255,0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
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
  emptyProfile: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 32,
  },
});