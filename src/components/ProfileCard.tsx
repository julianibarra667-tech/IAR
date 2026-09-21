import { Image, StyleSheet, Text, View } from "react-native";

type ProfileCardProps = {
  name: string;
  email?: string;
  level?: string;
  points?: string;
  progress?: number;
  image?: string;
};

export function ProfileCard({
  name,
  email = "correo@ejemplo.com",
  level = "Plata",
  points = "1,250 Pts.",
  progress = 52,
  image,
}: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback} />
        )}
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoText}>{name}</Text>
        <Text style={styles.infoText}>Apellido</Text>
        <Text style={styles.infoText}>{email}</Text>
        <Text style={styles.infoText}>Fecha de creacion</Text>
        <Text style={styles.infoText}>Progreso</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.expLabel}>EXP</Text>
          <Text style={styles.levelText}>Nivel: {level}</Text>
        </View>

        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.pointsRow}>
          <Text style={styles.pointsText}>1405/3000</Text>
          <Text style={styles.pointsText}>{points}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "#d8aaf2",
  },
  avatarFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "#d8aaf2",
  },
  infoBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  infoText: {
    color: "#f5dcff",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    textAlign: "center",
  },
  progressSection: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  expLabel: {
    backgroundColor: "#c563d9",
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelText: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
  },
  progressBarWrap: {
    height: 12,
    borderRadius: 20,
    backgroundColor: "#40204d",
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#d89ce8",
    borderRadius: 20,
  },
  pointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsText: {
    color: "#f5dcff",
    fontSize: 12,
    fontWeight: "700",
  },
});