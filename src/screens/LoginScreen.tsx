import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-facebook";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { saveToken } from "../utils/auth";
import { API_URL } from "../config/api";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================
  // GOOGLE AUTH
  // ======================
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID!,
    redirectUri: AuthSession.makeRedirectUri({ scheme: "sermonapp" }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication?.accessToken;
      if (!accessToken) return Alert.alert("Erreur", "Token Google introuvable");
      handleGoogleLoginServer(accessToken);
    }
  }, [response]);

  // ======================
  // EMAIL / PASSWORD LOGIN
  // ======================
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Erreur", "Veuillez remplir email et mot de passe");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) return Alert.alert("Erreur", data?.error || "Connexion échouée");

      await saveToken(data.token);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de se connecter");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // GOOGLE → BACKEND
  // ======================
  const handleGoogleLoginServer = async (accessToken: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();

      if (!res.ok) return Alert.alert("Erreur Google", data?.error || "Connexion échouée");

      await saveToken(data.token);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Connexion Google échouée");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // FACEBOOK LOGIN
  // ======================
  // const handleFacebookLogin = async () => {
  //   setLoading(true);
  //   try {
  //     await Facebook.initializeAsync({ appId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID! });
  //     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
  //       permissions: ["public_profile", "email"],
  //     });

  //     if (type !== "success" || !token) {
  //       setLoading(false);
  //       return Alert.alert("Erreur", "Connexion Facebook annulée");
  //     }

  //     // Envoie le token au backend
  //     const res = await fetch(`${API_URL}/api/auth/facebook-login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ accessToken: token }),
  //     });
  //     const data = await res.json();

  //     if (!res.ok) return Alert.alert("Erreur Facebook", data?.error || "Connexion échouée");

  //     await saveToken(data.token);
  //     navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert("Erreur", "Connexion Facebook échouée");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icons/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#94A3B8"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Se connecter</Text>}
      </TouchableOpacity>

      {/* GOOGLE LOGIN */}
      <TouchableOpacity style={styles.googleBtn} onPress={() => promptAsync()} disabled={!request || loading}>
        <Ionicons name="logo-google" size={20} color="#000" />
        <Text style={styles.googleText}>Continuer avec Google</Text>
      </TouchableOpacity>

      {/* FACEBOOK LOGIN */}
      {/* <TouchableOpacity style={styles.facebookBtn} onPress={handleFacebookLogin} disabled={loading}>
        <FontAwesome name="facebook" size={20} color="#fff" />
        <Text style={styles.facebookText}>Continuer avec Facebook</Text>
      </TouchableOpacity> */}

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
  facebookBtn: { flexDirection: "row", backgroundColor: "#1877F2", padding: 14, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 16 },
  facebookText: { marginLeft: 6, color: "#fff" },
  link: { marginTop: 20, color: "#2563EB", textAlign: "center" },
});