// components/BottomNavbar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../src/utils/auth";

export default function BottomNavbar({ navigation, colors }: any) {
  const goToProfile = async () => {
    const token = await getToken();
    if (token) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View
      style={[
        styles.navbar,
        { backgroundColor: colors.card, borderTopColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={styles.navItemActive}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home" size={30} color={colors.primary} />
        <Text style={[styles.navLabelActive, { color: colors.primary }]}>
          Accueil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="play-circle-outline" size={30} color={colors.muted} />
        <Text style={[styles.navLabel, { color: colors.muted }]}>
          Reels
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="search" size={30} color={colors.muted} />
        <Text style={[styles.navLabel, { color: colors.muted }]}>
          Découvrir
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="heart-outline" size={30} color={colors.muted} />
        <Text style={[styles.navLabel, { color: colors.muted }]}>
          Favoris
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={goToProfile}>
        <Ionicons name="person-outline" size={30} color={colors.muted} />
        <Text style={[styles.navLabel, { color: colors.muted }]}>
          Moi
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
  },
  navItem: { alignItems: "center" },
  navItemActive: { alignItems: "center" },
  navLabel: { fontSize: 11, marginTop: 4 },
  navLabelActive: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
});