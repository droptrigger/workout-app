import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../localization/i18n';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  onAccept: () => void;
}

export const CURRENT_PRIVACY_VERSION = '1.0';

export const PrivacyPolicyScreen: React.FC<Props> = ({ onAccept }) => {
    const handleAccept = async () => {
        await AsyncStorage.setItem('privacyAcceptedVersion', CURRENT_PRIVACY_VERSION);
        onAccept();
    };

    const { mode, setMode, theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: 20,
            width: '100%',
            maxHeight: '80%',
            padding: 30
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.header,
            textAlign: 'center'
        },
        text: {
            fontSize: 16,
            marginBottom: 10,
            color: theme.dayText,
        },
        buttonContainer: {
            marginTop: 5,
            padding: 13,
            backgroundColor: theme.primary,
            borderRadius: 15
        },
        buttonText: {
            color: 'white',
            fontWeight: '600',
            textAlign: 'center',
            fontSize: 16
        },
    });


    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ScrollView>
                    <Text style={styles.title}>{i18n.t('privacyPolicy')}</Text>
                    <Text style={styles.text}>{i18n.t('privacyPolicyFirst')}</Text>
                    <Text style={styles.text}>{i18n.t('privacyPolicySecond')}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleAccept}>
                            <Text style={styles.buttonText}>{i18n.t('privacyPolicyConfirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        
        </View>
    );
};
