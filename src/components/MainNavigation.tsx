import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutsIcon from '../components/icons/WorkoutsIcon';
import PlusIcon from '../components/icons/PlusIcon';
import ProfileIcon from '../components/icons/ProfileIcon';
import CreatePatternScreen from '../screens/CreatePatternScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from '../localization/i18n';
import { useTheme } from '../theme/ThemeContext';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import SelectPatternScreen from '../screens/SelectPatternScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditPatternScreen from '../screens/EditPatternScreen';
import { StatusBar } from 'react-native';
import { useLanguage } from '../localization/LanguageContext';

const Tab = createBottomTabNavigator();
const WorkoutsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const AddTemplateStack = createNativeStackNavigator();

function WorkoutsStackScreen() {
  const { theme } = useTheme();
  return (
    <WorkoutsStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: theme.header },
      }}
    >
      <WorkoutsStack.Screen name="WorkoutsMain" component={WorkoutsScreen} options={() => ({ title: i18n.t('trains') })} />
      <WorkoutsStack.Screen name="SelectPattern" component={SelectPatternScreen} options={() => ({ title: i18n.t('templateSelection') })} />
    </WorkoutsStack.Navigator>
  );
}

function ProfileStackScreen() {
  const { theme } = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: theme.header },
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={() => ({ title: i18n.t('profile') })} />
      <ProfileStack.Screen name="EditPattern" component={EditPatternScreen} options={() => ({ title: i18n.t('templateEditing') })} />
    </ProfileStack.Navigator>
  );
}

function AddTemplateStackScreen() {
  const { theme } = useTheme();
  return (
    <AddTemplateStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: theme.header },
      }}
    >
      <AddTemplateStack.Screen name="AddTemplateMain" component={CreatePatternScreen} options={() => ({ title: i18n.t('addTemplate') })} />
    </AddTemplateStack.Navigator>
  );
}

const MainNavigation = () => {
  const { mode, setMode, theme } = useTheme();
  const { language } = useLanguage();

  return (
    <NavigationContainer>
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'WorkoutsTab') return <WorkoutsIcon color={color} size={size} />;
            if (route.name === 'AddTemplate') return <PlusIcon color={color} size={size} />;
            if (route.name === 'ProfileTab') return <ProfileIcon color={color} size={size} />;
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
        <Tab.Screen name="WorkoutsTab" component={WorkoutsStackScreen} options={{ tabBarLabel: i18n.t('trains') }} />
        <Tab.Screen name="AddTemplate" component={AddTemplateStackScreen} options={{ tabBarLabel: i18n.t('addTemplate') }} />
        <Tab.Screen name="ProfileTab" component={ProfileStackScreen} options={{ tabBarLabel: i18n.t('profile') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
