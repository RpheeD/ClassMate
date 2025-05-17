import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen'; // ✅ already imported
import PostListScreen from '../screens/PostListScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostList"
          component={PostListScreen}
          options={{ headerTitle: 'ClassMate' }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{ headerTitle: 'New Post' }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetailScreen}
          options={{ headerTitle: 'Post Details' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerTitle: 'Profile' }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerTitle: 'Edit Profile' }} // ✅ add screen and title
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
