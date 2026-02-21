import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        // Add custom fonts here if needed
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="sermon/[id]" options={{ presentation: 'modal', title: 'Sermon' }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}
