import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../types/navigation'
import BlogListScreen from '../screens/BlogList'
import BlogDetailsScreen from '../screens/BlogDetails'
import { enableScreens } from 'react-native-screens'

enableScreens(true)

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="BlogList" component={BlogListScreen} options={{ title: 'Blogs' }} />
        <Stack.Screen name="BlogDetails" component={BlogDetailsScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

