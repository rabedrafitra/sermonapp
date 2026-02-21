import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function SectionHeader({ title, actionLabel = "Voir tout", onAction }: SectionHeaderProps) {
    return (
        <View className="flex-row items-center justify-between mb-4 mt-6">
            <Text className="text-xl font-bold text-gray-900">{title}</Text>
            <TouchableOpacity onPress={onAction}>
                <Text className="text-blue-600 font-medium text-sm">{actionLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}
