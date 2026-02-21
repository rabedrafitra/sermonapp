import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Profile() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 px-4 pt-4">
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4 border-2 border-white shadow-sm">
                        <FontAwesome name="user" size={40} color="#007AFF" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900">Utilisateur Invité</Text>
                    <Text className="text-gray-500">invte@exemple.com</Text>
                </View>

                <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
                        <FontAwesome name="gear" size={20} color="#666" className="w-8" />
                        <Text className="flex-1 text-base text-gray-700 ml-3">Paramètres</Text>
                        <FontAwesome name="angle-right" size={16} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
                        <FontAwesome name="bell" size={20} color="#666" className="w-8" />
                        <Text className="flex-1 text-base text-gray-700 ml-3">Notifications</Text>
                        <FontAwesome name="angle-right" size={16} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4">
                        <FontAwesome name="sign-out" size={20} color="#FF3B30" className="w-8" />
                        <Text className="flex-1 text-base text-red-500 ml-3">Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

