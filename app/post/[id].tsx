import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GlobalStyles } from '../../constants/styles';

export default function SermonDetails() {
    const { id } = useLocalSearchParams();

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.title}>Détails du Sermon {id}</Text>
            {/* AudioPlayer and content will go here */}
        </View>
    );
}
