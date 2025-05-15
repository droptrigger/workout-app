// src/screens/EditPatternScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { updatePattern, getPatternWithExercises } from '../db/patternUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function EditPatternScreen({ navigation, route }: any) {
    const { pattern } = route.params;
    const [name, setName] = useState(pattern.name);
    const [exercises, setExercises] = useState<string[]>([]);
    const [initialExercises, setInitialExercises] = useState<string[]>([]);

    useEffect(() => {
        const loadExercises = async () => {
            const exList = await getPatternWithExercises(pattern.id);
            const exercises = exList.map(ex => ex.exercise);
            setExercises(exercises);
            setInitialExercises(exercises);
        };
        loadExercises();
    }, []);

    const updateExercise = (index: number, value: string) => {
        const updated = [...exercises];
        updated[index] = value;
        setExercises(updated);
    };

    const addExercise = () => {
        setExercises([...exercises, '']);
    };

    const removeExercise = (index: number) => {
        const updated = exercises.filter((_, i) => i !== index);
        setExercises(updated);
    };

    const handleUpdate = async () => {
        const trimmedName = name.trim();
        const trimmedExercises = exercises.map(e => e.trim()).filter(e => e !== '');

        if (!trimmedName) {
            Alert.alert('Ошибка', 'Введите название шаблона');
            return;
        }

        if (trimmedExercises.length === 0) {
            Alert.alert('Ошибка', 'Добавьте хотя бы одно упражнение');
            return;
        }

        try {
            await updatePattern(pattern.id, trimmedName, trimmedExercises);
            Alert.alert('Успешно', 'Шаблон успешно обновлен');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось обновить шаблон');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContentContainer}
                    enableOnAndroid
                    extraScrollHeight={80}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.card}>
                        <Text style={styles.label}>Название</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Название шаблона"
                        />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.label}>Упражнения</Text>
                        {exercises.map((ex, index) => (
                            <View key={index} style={styles.exerciseRow}>
                                <TextInput
                                    style={styles.exerciseInput}
                                    value={ex}
                                    onChangeText={(text) => updateExercise(index, text)}
                                    placeholder={`Упражнение ${index + 1}`}
                                    multiline
                                />
                                <TouchableOpacity 
                                    onPress={() => removeExercise(index)} 
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TouchableOpacity onPress={addExercise}>
                            <Text style={styles.addText}>+ Добавить упражнение</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Сохранить изменения</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12
    },
    scrollContentContainer: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 17
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        marginBottom: 12,
        borderRadius: 5,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    exerciseInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        marginLeft: 10,
        padding: 8,
    },
    deleteButtonText: {
        fontSize: 18,
        color: '#d00',
    },
    addText: {
        color: '#4CAF50',
        fontSize: 16,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginInline: 15,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});