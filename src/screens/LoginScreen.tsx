import React, { useState } from "react";
import { saveToken } from '../utils/auth';
import { API_URL } from "../config/api";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  ScrollView, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // parse safe
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Réponse non JSON :", text);
      throw new Error("Réponse serveur invalide");
    }

    if (!res.ok) {
      console.error("Erreur login :", data.error);
      return;
    }

    // ✅ sauvegarde token
    await saveToken(data.token);

    // ✅ navigation
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });

  } catch (err) {
    console.error("Erreur fetch login :", err);
  }
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/icons/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Connexion</Text>

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

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Se connecter</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={20} color="#000" />
        <Text style={styles.googleText}>Continuer avec Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
    </ScrollView>
   
    
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F8FAFC", padding: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 24 },
  logo: { width: 120, height: 120 },
  title: { fontSize: 28, marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16, backgroundColor: "#fff" },
  primaryBtn: { backgroundColor: "#2563EB", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 8 },
  primaryText: { color: "white", fontSize: 16 },
  googleBtn: { flexDirection: "row", borderWidth: 1, borderColor: "#E2E8F0", padding: 14, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 16 },
  googleText: { marginLeft: 6 },
  link: { marginTop: 20, color: "#2563EB", textAlign: "center" },
});