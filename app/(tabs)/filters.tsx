import { View, Text, ScrollView, Switch } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import { useState } from 'react';

export default function Filters() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <Text className="text-2xl font-bold mb-6 text-gray-900">Filtres</Text>

            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-100">
                <Text className="text-base font-semibold mb-4 text-gray-800">Thèmes</Text>
                <View className="flex-row flex-wrap gap-2">
                    {['Tout', 'Evangile', 'Etude', 'Jeunesse', 'Louange'].map(cat => (
                        <View key={cat} className="bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                            <Text className="text-gray-600">{cat}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View className="bg-white p-4 rounded-xl mb-4 border border-gray-100 flex-row justify-between items-center">
                <Text className="text-base font-semibold text-gray-800">Téléchargeable uniquement</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#007AFF" }}
                    thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
        </ScrollView>
    );
}

