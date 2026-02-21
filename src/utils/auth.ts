import { Platform } from 'react-native'

let SecureStore: any = null

if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store')
}

/**
 * Récupérer le token
 */
export async function getToken(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem('token')
    }

    if (!SecureStore) return null
    return await SecureStore.getItemAsync('token')
  } catch (err) {
    console.error('Erreur getToken:', err)
    return null
  }
}

/**
 * Sauvegarder le token (STRING UNIQUEMENT)
 */
export async function saveToken(token: unknown): Promise<void> {
  try {
    if (typeof token !== 'string' || token.length === 0) {
      throw new Error('Token invalide (doit être une string non vide)')
    }

    if (Platform.OS === 'web') {
      localStorage.setItem('token', token)
      return
    }

    if (!SecureStore) {
      throw new Error('SecureStore non disponible')
    }

    await SecureStore.setItemAsync('token', token)
  } catch (err) {
    console.error('Erreur saveToken:', err)
    throw err
  }
}

/**
 * Supprimer le token
 */
export async function removeToken(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token')
      return
    }

    if (!SecureStore) return
    await SecureStore.deleteItemAsync('token')
  } catch (err) {
    console.error('Erreur removeToken:', err)
  }
}