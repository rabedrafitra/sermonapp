import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.tabIconDefault,
                headerShown: true,
                headerStyle: { backgroundColor: Colors.white },
                headerTitleStyle: { color: Colors.text },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Accueil',
                    tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favoris',
                    tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="filters"
                options={{
                    title: 'Filtres',
                    tabBarIcon: ({ color }) => <FontAwesome name="filter" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
