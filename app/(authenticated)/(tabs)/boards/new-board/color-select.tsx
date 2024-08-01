import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export const COLORS = [
  '#0079bf',
  '#d29034',
  '#519839',
  '#b04632',
  '#89609e',
  '#cd5a91',
  '#4bbf6b',
  '#00aecc',
  '#838c91',
];

export const DEFAULT_COLOR = COLORS[0];

const Page = () => {
  const [selected, setSelected] = useState(DEFAULT_COLOR);
  const router = useRouter();

  const onColorSelect = (color: string) => {
    setSelected(color);
    router.setParams({ bg: color });
  };
  return (
    <View style={styles.container}>
      {COLORS.map(color => (
        <TouchableOpacity
          key={color}
          style={[
            styles.btnItem,
            { backgroundColor: color, borderWidth: selected === color ? 2 : 0 },
          ]}
          onPress={() => onColorSelect(color)}
        ></TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  btnItem: {
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 4,
    borderColor: Colors.fontDark,
  },
});

export default Page;
