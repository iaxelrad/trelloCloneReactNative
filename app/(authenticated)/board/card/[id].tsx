import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Card ID: {id}</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
