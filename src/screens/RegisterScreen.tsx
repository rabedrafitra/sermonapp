import React, { useState } from "react";
import { API_URL } from "../config/api";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }

    setLoading(true);
    try {
      const res = await fetch(
       `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Succès", "Inscription réussie !");
        navigation.goBack();
      } else {
        Alert.alert("Erreur", data.error || "Erreur serveur");
      }
    } catch (err) {
      Alert.alert("Erreur", "Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>Créer un compte</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={20} color="#000" />
        <Text style={styles.googleText}>S'inscrire avec Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  googleBtn: {
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  googleText: {
    fontFamily: "Inter_600SemiBold",
    marginLeft: 4,
  },
  link: {
    marginTop: 20,
    color: "#2563EB",
    textAlign: "center",
  },
});
