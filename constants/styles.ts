import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
