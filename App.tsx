import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { initDB } from './src/db/db';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import MainNavigation from './src/components/MainNavigation';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initDB();
      setDbReady(true);
    })();
  }, []);

  if (!dbReady) return null;

  return (

    <ThemeProvider> 
        <MainNavigation />
    </ThemeProvider>

  );
}