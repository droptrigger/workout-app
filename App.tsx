import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { initDB } from './src/db/db';
import { ThemeProvider } from './src/theme/ThemeContext';
import MainNavigation from './src/components/MainNavigation';
import { PrivacyPolicyScreen, CURRENT_PRIVACY_VERSION } from './src/screens/PrivacyPolicyScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const acceptedVersion = await AsyncStorage.getItem('privacyAcceptedVersion');
      setAcceptedPolicy(acceptedVersion === CURRENT_PRIVACY_VERSION);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await initDB();
      setDbReady(true);
    })();
  }, []);

  if (!dbReady) {
    return <SplashScreen />;
  }

  if (acceptedPolicy === null || (acceptedPolicy && !dbReady)) {
    return null;
  }

  return (
    <ThemeProvider>
      <MainNavigation />

      <Modal
        visible={!acceptedPolicy}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
        }}
      >
        <PrivacyPolicyScreen onAccept={() => setAcceptedPolicy(true)} />
      </Modal>
    </ThemeProvider>
  );
}
