import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from 'react-native';
import PatternCard from '../components/PatternCard';
import { getDB, initDB } from '../db/db';
import { getAllPatterns, deletePattern } from '../db/patternUtils';
import { ProfileStats, Pattern } from '../types/types';
import { useFocusEffect } from '@react-navigation/native';
import i18n from '../localization/i18n';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';

export default function ProfileScreen({ navigation }: any) {
    const [stats, setStats] = useState<ProfileStats>({
        totalWorkouts: 0,
    });
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);
    const { mode, setMode, theme } = useTheme();
    const { language, setLanguage } = useLanguage();

    useLayoutEffect(() => {
      navigation.setOptions({ title: i18n.t('profile') });
    }, [navigation, language]);

    function ThemeToggle() {
        const modes: { label: string; value: 'light' | 'dark' | 'system' }[] = [
            { label: i18n.t('lightTheme'), value: 'light' },
            { label: i18n.t('darkTheme'), value: 'dark' },
        ];

        const handlePress = (value: 'light' | 'dark' | 'system') => {
            if (mode === value) {
                setMode('system');
            } else {
                setMode(value);
            }
        };

        return (
            <View style={{ marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.header, marginBottom: 2 }}>
                {i18n.t('theme')}
            </Text>
            {modes.map((m) => (
                <TouchableOpacity
                key={m.value}
                onPress={() => handlePress(m.value)}
                style={{
                    padding: 10,
                    backgroundColor: mode === m.value ? theme.primary : theme.card,
                    borderRadius: 8,
                    marginVertical: 4,
                }}
                >
                <Text style={{ color: mode === m.value ? '#fff' : theme.text }}>
                    {m.label}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        );
    }

    function LanguageToggle() {
        const languages = [
            { label: '🇷🇺 Русский', value: 'ru' },
            { label: '🇺🇸 English', value: 'en' },
            { label: '🇨🇳 中文', value: 'zh' },
        ];

        return (
            <View style={{ marginBottom: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, color: theme.header, marginBottom: 2 }}>
                    {i18n.t('language')}
                </Text>
                {languages.map((l) => (
                    <TouchableOpacity
                        key={l.value}
                        onPress={() => setLanguage(l.value)}
                        style={{
                            padding: 10,
                            backgroundColor: language === l.value ? theme.primary : theme.card,
                            borderRadius: 8,
                            marginVertical: 4,
                        }}
                    >
                        <Text style={{ color: language === l.value ? '#fff' : theme.text }}>
                            {l.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

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
                i18n.t('confirmation'),
                i18n.t('confirmationDeleteTemplate'),
                [
                {
                    text: i18n.t('cancel'),
                    style: 'cancel'
                },
                {
                    text: i18n.t('delete'),
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background
        },
        scrollContent: {
            flex: 1,
        },
        statsContainer: {
            marginTop: 10,
            backgroundColor: theme.card,
            marginHorizontal: 16,
            padding: 16,
            borderRadius: 12,
            marginBottom: 10,
        },
        patternsContainer: {
            marginHorizontal: 16,
            marginBottom: 10,
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
            color: theme.statLabel,
        },
        statValue: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.header
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.header
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContent}>
                <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>{i18n.t('statistics')}</Text>
                
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                    <>
                        <StatItem label={i18n.t('totalTraining')} value={stats.totalWorkouts} styles={styles} />
                        <StatItem label={i18n.t('templatesCreated')} value={patterns.length} styles={styles} />
                    </>
                )}
                </View>

                <View style={styles.patternsContainer}>
                    <ThemeToggle />
                </View>

                <View style={styles.patternsContainer}>
                    <LanguageToggle />
                </View>

                <View style={styles.patternsContainer}>
                    <Text style={styles.sectionTitle}>{i18n.t('trainingTemplates')}</Text>
                    
                    {loading ? ( <ActivityIndicator size="large" color="#4CAF50" />) : 
                    ( patterns.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{i18n.t('emptyTemplates')}</Text>
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

    function StatItem({
        label,
        value,
        styles
    }: {
        label: string;
        value: string | number;
        styles: any;
    }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}