import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_COLOR } from './color-select';

const Page = () => {
  const [boardName, setBoardName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLOR);
  const router = useRouter();
  const { bg } = useGlobalSearchParams<{ bg?: string }>();

  useEffect(() => {
    console.log('BG', bg);
    if (bg) {
      setSelectedColor(bg);
    }
  }, [bg]);

  const onCreateBoard = async () => {};

  return (
    <View style={{ marginVertical: 10 }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={onCreateBoard}
              disabled={boardName === ''}
            >
              <Text
                style={
                  boardName === '' ? styles.btnTextDisabled : styles.btnText
                }
              >
                Create
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="New Board"
        value={boardName}
        onChangeText={setBoardName}
        autoFocus
      />

      <Link
        href="/(authenticated)/(tabs)/boards/new-board/color-select"
        asChild
      >
        <TouchableOpacity style={styles.btnItem}>
          <Text style={styles.btnItemText}>Background</Text>
          <View
            style={[styles.colorPreview, { backgroundColor: selectedColor }]}
          />
          <Ionicons name="chevron-forward" size={22} color={Colors.grey} />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  btnText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary,
  },
  btnTextDisabled: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.grey,
  },
  input: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    backgroundColor: '#fff',
    padding: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    marginBottom: 32,
  },
  btnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    gap: 4,
  },
  btnItemText: {
    fontSize: 16,
    flex: 1,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
});
