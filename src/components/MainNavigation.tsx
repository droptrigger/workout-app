import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutsIcon from '../components/icons/WorkoutsIcon';
import PlusIcon from '../components/icons/PlusIcon';
import ProfileIcon from '../components/icons/ProfileIcon';
import CreatePatternScreen from '../screens/CreatePatternScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from '../localization/i18n';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import SelectPatternScreen from '../screens/SelectPatternScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditPatternScreen from '../screens/EditPatternScreen';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  const { mode, setMode, theme } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="EditPattern" 
        component={EditPatternScreen}
          options={{
            title: i18n.t('templateEditing'),
            headerStyle: {
              backgroundColor: theme.card,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: theme.header
            },
          }}
      />
    </Stack.Navigator>
  )
}

const WorkoutStack = () => {
  const { mode, setMode, theme } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WorkoutMain"
        component={WorkoutsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectPattern"
        component={SelectPatternScreen}
        options={{
          title: i18n.t('templateSelection'),
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: theme.header
          },
        }}
      />
    </Stack.Navigator>
  );
};

const MainNavigation = () => {
  const { mode, setMode, theme } = useTheme();

  return (
    <NavigationContainer>
        <StatusBar
            barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.header,
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === i18n.t('trains')) return <WorkoutsIcon color={color} size={size} />;
            if (route.name === i18n.t('addTemplate')) return <PlusIcon color={color} size={size} />;
            if (route.name === i18n.t('profile')) return <ProfileIcon color={color} size={size} />;
            return null;
          },
          tabBarActiveTintColor: theme.activeIconColor,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            height: 80,
            paddingTop: 5,
            backgroundColor: theme.card,
            borderColor: theme.card,
          },
        })}
      >
        <Tab.Screen name={i18n.t('trains')} component={WorkoutStack} />
        <Tab.Screen name={i18n.t('addTemplate')} component={CreatePatternScreen} />
        <Tab.Screen name={i18n.t('profile')} component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
