import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { createPattern } from '../db/patternUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from '../localization/i18n';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';

export default function CreatePatternScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [exercises, setExercises] = useState<string[]>(['']);
    const { mode, setMode, theme } = useTheme();
    const { language } = useLanguage();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const scrollRef = useRef<KeyboardAwareScrollView>(null);

    useLayoutEffect(() => {
      navigation.setOptions({ title: i18n.t('addTemplate') });
    }, [navigation, language]);

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
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

    const handleCreate = async () => {
        const trimmedName = name.trim();
        const trimmedExercises = exercises.map(e => e.trim()).filter(e => e !== '');

        if (!trimmedName) {
            Alert.alert(i18n.t('error'), i18n.t('errorEnterName'));
            return;
        }

        if (trimmedExercises.length === 0) {
            Alert.alert(i18n.t('error'), i18n.t('errorAddExercise'));
            return;
        }

        await createPattern(trimmedName, trimmedExercises);
        Alert.alert(i18n.t('successfully'), `${i18n.t('successfullyCreateTemplateMessage')}${name}`);
        setName('');
        setExercises(['']);
        navigation.goBack();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: theme.background
        },
        scrollContainer: {
            flex: 1,
            paddingHorizontal: 15,
        },
        card: {
            backgroundColor: theme.card,
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
            fontSize: 17,
            color: theme.header
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
            color: theme.header,
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
            color: theme.header
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
        <View style={styles.container}>
            <KeyboardAwareScrollView
                ref={scrollRef}
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContentContainer}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
            <View style={styles.card}>
                <Text style={styles.label}>{i18n.t('nameTemplate')}</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                    }}
                    placeholder={i18n.t('placeholderNameTemplate')}
                    placeholderTextColor={theme.placeholderText}
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>{i18n.t('exercisesTemplate')}</Text>
                {exercises.map((ex, index) => (
                    <View key={index} style={styles.exerciseRow}>
                    <TextInput
                        style={styles.exerciseInput}
                        value={ex}
                        onChangeText={(text) => updateExercise(index, text)}
                        placeholder={`${i18n.t('placeholderExercisesTempalte')}${index + 1}`}
                        multiline
                        placeholderTextColor={theme.placeholderText}
                        onFocus={event => {
                          scrollRef.current?.scrollToFocusedInput(event.target, 170);
                        }}
                    />
                    <TouchableOpacity onPress={() => removeExercise(index)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity onPress={addExercise}>
                    <Text style={styles.addText}>{i18n.t('addExerciseTemplate')}</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
            
            {!keyboardVisible && (
              <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>{i18n.t('confirm')}</Text>
              </TouchableOpacity>
            )}
        </View>
        </KeyboardAvoidingView>
    );
}