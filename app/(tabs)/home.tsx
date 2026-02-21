import { View, Text, ScrollView, SafeAreaView, FlatList, TextInput } from 'react-native';
import { GlobalStyles } from '../../constants/styles';
import SermonCard from '../../components/SermonCard';
import CategoryBadge from '../../components/CategoryBadge';
import SectionHeader from '../../components/SectionHeader';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

const mockSermons = [
    { id: '1', title: 'La Foi qui déplace les montagnes', author: 'Pasteur Jean', style: 'Evangélique', duration: '52 min' },
    { id: '2', title: 'L\'amour du prochain', author: 'Père Michel', style: 'Catholique', duration: '34 min' },
    { id: '3', title: 'Le pouvoir de la prière', author: 'Dr. Martin', style: 'Pentecôtiste', duration: '1h 12' },
];

const categories = ['Tout', 'Evangile', 'Etude Biblique', 'Jeunesse', 'Louange'];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('Tout');

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-4 pt-2">
                {/* Search Bar Refined */}
                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6 shadow-sm">
                    <FontAwesome name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Rechercher un sermon, un orateur..."
                        className="flex-1 ml-3 text-gray-700 text-base"
                        placeholderTextColor="#9CA3AF"
                    />
                    <FontAwesome name="sliders" size={20} color="#007AFF" />
                </View>

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                    {categories.map((cat) => (
                        <CategoryBadge
                            key={cat}
                            label={cat}
                            active={activeCategory === cat}
                            onPress={() => setActiveCategory(cat)}
                        />
                    ))}
                </ScrollView>

                {/* Featured / Hero Section placeholder */}
                <View className="mt-4 mb-2">
                    <View className="bg-blue-600 rounded-2xl p-6 shadow-lg shadow-blue-200">
                        <View className="flex-row justify-between items-start">
                            <View>
                                <Text className="text-blue-100 font-bold text-xs uppercase mb-2">À la une</Text>
                                <Text className="text-white text-2xl font-bold max-w-[200px]">Retrouver la paix intérieure</Text>
                            </View>
                            <View className="bg-white/20 p-3 rounded-full">
                                <FontAwesome name="play" size={24} color="white" />
                            </View>
                        </View>
                        <Text className="text-blue-100 mt-4 text-sm">Pasteur David - Culte du Dimanche</Text>
                    </View>
                </View>

                {/* Latest Sermons */}
                <SectionHeader title="Derniers Sermons" />

                <View className="pb-20">
                    {mockSermons.map((item) => (
                        <SermonCard
                            key={item.id}
                            title={item.title}
                            author={item.author}
                            style={item.style}
                            duration={item.duration}
                        />
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
