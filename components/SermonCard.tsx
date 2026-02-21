import { View, Text, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styled } from 'nativewind';

interface SermonCardProps {
    title: string;
    author: string;
    style: string;
    duration?: string;
    imageUrl?: string;
}

export default function SermonCard({ title, author, style, duration = '45 min', imageUrl }: SermonCardProps) {
    return (
        <View className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 overflow-hidden">
            {/* Media Placeholder or Image */}
            <View className="h-40 bg-blue-100 items-center justify-center relative">
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <FontAwesome name="play-circle" size={48} color="#007AFF" />
                )}
                <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-md">
                    <Text className="text-white text-xs font-bold">{duration}</Text>
                </View>
            </View>

            <View className="p-4">
                {/* Chips / Tags */}
                <View className="flex-row items-center mb-2">
                    <View className="bg-blue-50 px-2 py-1 rounded-full mr-2">
                        <Text className="text-blue-600 text-[10px] font-bold uppercase">{style}</Text>
                    </View>
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-1 leading-6">{title}</Text>
                <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                        <View className="w-6 h-6 bg-gray-200 rounded-full items-center justify-center mr-2">
                            <FontAwesome name="user" size={12} color="#666" />
                        </View>
                        <Text className="text-gray-500 text-sm">{author}</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name="heart-o" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
