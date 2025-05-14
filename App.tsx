import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initDB } from './src/db/db';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import WorkoutsIcon from './src/components/icons/WorkoutsIcon';
import PlusIcon from './src/components/icons/PlusIcon';
import ProfileIcon from './src/components/icons/ProfileIcon';
import CreatePatternScreen from './src/screens/CreatePatternScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditPatternScreen from './src/screens/EditPatternScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectPatternScreen from './src/screens/SelectPatternScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="EditPattern" 
      component={EditPatternScreen}
      options={{ title: 'Редактирование' }}
    />
  </Stack.Navigator>
);

const WorkoutStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="WorkoutMain"
      component={WorkoutsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SelectPattern"
      component={SelectPatternScreen}
      options={{ title: 'Выбор шаблона' }}
    />
  </Stack.Navigator>
);

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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Тренировки') return <WorkoutsIcon color={color} size={size} />;
            if (route.name === 'Добавить') return <PlusIcon color={color} size={size} />;
            if (route.name === 'Профиль') return <ProfileIcon color={color} size={size} />;
            return null;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { height: 80 },
        })}
      >
        <Tab.Screen name="Тренировки" component={WorkoutStack} />
        <Tab.Screen name="Добавить" component={CreatePatternScreen} />
        <Tab.Screen name="Профиль" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}