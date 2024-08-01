import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTitle: () => (
            <Image
              style={{ width: 120, height: 50, resizeMode: 'contain' }}
              source={require('@/assets/images/trello-logo-gradient-white.png')}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
