import { View, Text, SafeAreaView, FlatList } from 'react-native';
import SermonCard from '../../components/SermonCard';

export default function Favorites() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 px-4 pt-4">
                <Text className="text-2xl font-bold mb-6 text-gray-900">Favoris</Text>
                <View className="flex-1 justify-center items-center opacity-50">
                    <Text className="text-gray-400 text-lg">Aucun favori pour le moment</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

