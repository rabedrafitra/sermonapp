import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { API_URL } from '../config/api'
import { getToken, removeToken } from '../utils/auth'   // 🔹 importer removeToken
import { useNavigation } from '@react-navigation/native'

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation();  // 🔹 navigation pour rediriger après logout

  async function loadProfile() {
    const token = await getToken()
    if (!token) return

    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()
    setUser(data)
    setLoading(false)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  async function pickAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    })

    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri })
    }
  }

  async function saveProfile() {
    const token = await getToken()
    if (!token) return

    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
    })

    if (!res.ok) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil')
      return
    }

    Alert.alert('Succès', 'Profil mis à jour')
  }

  // 🔹 Fonction logout
  const logout = async () => {
    await removeToken()
    setUser(null)
    navigation.navigate("Login")   // 🔹 retourne à Login après logout
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickAvatar}>
        <Image
          source={{
            uri: user?.avatar || 'https://i.pravatar.cc/150',
          }}
          style={styles.avatar}
        />
        <Text style={styles.change}>Changer l’avatar</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={user?.name || ''}
        placeholder="Nom"
        onChangeText={(t) => setUser({ ...user, name: t })}
      />

      <TextInput
        style={styles.input}
        value={user?.email || ''}
        placeholder="Email"
        onChangeText={(t) => setUser({ ...user, email: t })}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.btn} onPress={saveProfile}>
        <Text style={styles.btnText}>Enregistrer</Text>
      </TouchableOpacity>

      {/* 🔴 BOUTON LOGOUT */}
      <TouchableOpacity
        onPress={logout}
        style={{
          marginTop: 24,
          padding: 14,
          borderRadius: 12,
          backgroundColor: "#EF4444",
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
          Se déconnecter
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  change: {
    textAlign: 'center',
    color: '#2563EB',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
})