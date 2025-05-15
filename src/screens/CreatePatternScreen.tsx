import React, { useState } from 'react';
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
import { createPattern } from '../db/patternUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function CreatePatternScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [exercises, setExercises] = useState<string[]>(['']);
    const [isModified, setIsModified] = useState(false);

    const updateExercise = (index: number, value: string) => {
        const updated = [...exercises];
        updated[index] = value;
        setExercises(updated);
        setIsModified(true);
    };

    const addExercise = () => {
        setExercises([...exercises, '']);
        setIsModified(true);
    };

    const removeExercise = (index: number) => {
        const updated = exercises.filter((_, i) => i !== index);
        setExercises(updated);
        setIsModified(true);
    };

    const handleCreate = async () => {
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

        await createPattern(trimmedName, trimmedExercises);
        Alert.alert('Успешно', `Вы успешно создали шаблон ${name}`);
        setName('');
        setExercises(['']);
        setIsModified(false);
        navigation.goBack();
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
                    onChangeText={(text) => {
                    setName(text);
                    setIsModified(true);
                    }}
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
                    <TouchableOpacity onPress={() => removeExercise(index)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={addExercise}>
                    <Text style={styles.addText}>+ Добавить упражнение</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
            
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Продолжить</Text>
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