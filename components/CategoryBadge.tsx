import { View, Text, TouchableOpacity } from 'react-native';

interface CategoryBadgeProps {
    label: string;
    active?: boolean;
    onPress?: () => void;
}

export default function CategoryBadge({ label, active, onPress }: CategoryBadgeProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2 rounded-full mr-3 border ${active ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
        >
            <Text className={`${active ? 'text-white' : 'text-gray-600'} font-semibold text-sm`}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}
