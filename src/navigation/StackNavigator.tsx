import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import TabNavigator from './TabNavigator';

// Screens (Resume Flow)
import CreateResumeScreen from '../screens/resume/CreateResumeScreen';
import ResumePreviewScreen from '../screens/resume/ResumePreviewScreen';

export type AppStackParamList = {
  Tabs: undefined;
  TemplateSelect: undefined;
  CreateResume: { template: string };
  ResumePreview: { resumeId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {/* Bottom Tabs */}
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

   

      <Stack.Screen
        name="CreateResume"
        component={CreateResumeScreen}
        options={{ title: 'Create Resume' }}
      />

      <Stack.Screen
        name="ResumePreview"
        component={ResumePreviewScreen}
        options={{ title: 'Resume Preview' }}
      />

      
    </Stack.Navigator>
  );
};

export default StackNavigator;
