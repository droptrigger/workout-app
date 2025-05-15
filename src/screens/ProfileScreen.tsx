import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import PatternCard from '../components/PatternCard';
import { getDB, initDB } from '../db/db';
import { getAllPatterns, deletePattern } from '../db/patternUtils';
import { ProfileStats, Pattern } from '../types/types';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }: any) {
    const [stats, setStats] = useState<ProfileStats>({
        totalWorkouts: 0,
    });
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
        const loadAllData = async () => {
            try {
            await initDB();
            const db = getDB();

            const workoutCount = await db.getFirstAsync<{count: number}>(
                'SELECT COUNT(*) AS count FROM workouts;'
            );

            const patternsData = await getAllPatterns();

            setStats({
                totalWorkouts: workoutCount?.count || 0,
            });
                setPatterns(patternsData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
        }, [])
    );

    const handleDeletePattern = async (id: number) => {
        try {
            Alert.alert(
                'Подтверждение',
                'Вы уверены, что хотите удалить этот шаблон?',
                [
                {
                    text: 'Отмена',
                    style: 'cancel'
                },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                    await deletePattern(id);
                    setPatterns(prev => prev.filter(p => p.id !== id));
                    }
                }
                ]
            );
        } catch (error) {
            console.error('Ошибка удаления шаблона:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContent}>
                <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Статистика</Text>
                
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                    <>
                        <StatItem label="Всего тренировок" value={stats.totalWorkouts} />
                        <StatItem label="Создано шаблонов" value={patterns.length} />
                    </>
                )}
                </View>

                <View style={styles.patternsContainer}>
                    <Text style={styles.sectionTitle}>Шаблоны тренировок</Text>
                    
                    {loading ? ( <ActivityIndicator size="large" color="#4CAF50" />) : 
                    ( patterns.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Вы не создали ни одного шаблона</Text>
                        </View>
                    ) : (
                        patterns.map(pattern => (
                            <PatternCard 
                                key={pattern.id}
                                pattern={pattern}
                                onDelete={() => handleDeletePattern(pattern.id)}
                                onEdit={() => navigation.navigate('EditPattern', { pattern })}
                            />
                        ))
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
    }

    function StatItem({ label, value }: { label: string; value: string | number }) {
        return (
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
            </View>
        );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    scrollContent: {
        flex: 1,
    },
    statsContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    patternsContainer: {
        marginHorizontal: 16,
        marginBottom: 15,
        flex: 1
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200, 
    },
});