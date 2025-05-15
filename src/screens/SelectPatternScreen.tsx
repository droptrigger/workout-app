import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { getAllPatterns } from '../db/patternUtils';
import { Pattern } from '../types/types';

const SelectPatternScreen = ({ navigation, route }: any) => {
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const { onSelect } = route.params || {};

    useEffect(() => {
        const loadPatterns = async () => {
        try {
            const data = await getAllPatterns();
            setPatterns(data);
        } catch (error) {
            console.error('Ошибка загрузки шаблонов:', error);
        } finally {
            setLoading(false);
        }
        };
        loadPatterns();
    }, []);

    const handleSelectPattern = async (pattern: Pattern) => {
        if (!onSelect) return;
            setProcessing(true);
        try {
            onSelect(pattern);
            navigation.goBack();
        } catch (error) {
            alert('Не удалось выбрать шаблон');
        } finally {
            setProcessing(false);
        }
    };

    const renderItem = ({ item }: { item: Pattern }) => (
        <TouchableOpacity
            style={[styles.patternItem, processing && styles.disabledItem]}
            onPress={() => !processing && handleSelectPattern(item)}
            disabled={processing}
        >
        {processing && <ActivityIndicator style={styles.loadingIndicator} color="#4CAF50" />}
        <Text style={styles.patternName}>{item.name}</Text>
        <Text style={styles.exerciseCount}>Упражнений: {item.exercises.length}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
        ) : patterns.length === 0 ? (
            <Text style={styles.emptyText}>Нет доступных шаблонов</Text>
        ) : (
            <FlatList
                data={patterns}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    patternItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        position: 'relative',
    },
    patternName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 4,
    },
    exerciseCount: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 40,
    },
    listContent: {
        paddingBottom: 20,
    },
    disabledItem: {
        opacity: 0.6,
    },
    loadingIndicator: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
});

export default SelectPatternScreen;