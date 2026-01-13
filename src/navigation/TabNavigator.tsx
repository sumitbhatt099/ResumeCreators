import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import AllResumesScreen from '../screens/resume/AllResumesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type TabParamList = {
  AllResumes: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // 🎨 Tab bar style
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,

        // 🎯 Active / inactive colors
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#9E9E9E',

        // 🔥 ICONS
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string = 'ellipse-outline';

          if (route.name === 'AllResumes') {
            iconName = focused
              ? 'document-text'
              : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused
              ? 'person'
              : 'person-outline';
          }

          return (
            <View style={focused ? styles.activeIconBox : undefined}>
              <Icon name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="AllResumes"
        component={AllResumesScreen}
        options={{ tabBarLabel: 'Resumes' }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'absolute',
    overflow: 'hidden',
    elevation: 10,
    backgroundColor: '#FFFFFF',
  },

  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },

  activeIconBox: {
    backgroundColor: '#E8F5E9',
    padding: 6,
    borderRadius: 20,
  },
});
