import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import i18n from '../localization/i18n';

export default function SplashScreen() {
  const [dots, setDots] = useState(0);
  const { mode, setMode, theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: theme.background
    },
    logo: {
      width: 150, 
      height: 150, 
      resizeMode: 'contain'
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.header,
      marginTop: 10
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev === 3 ? 0 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (  
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
      <Text style={styles.text}>{i18n.t('loading')}{'.'.repeat(dots)}</Text>
    </View>
  );
}
