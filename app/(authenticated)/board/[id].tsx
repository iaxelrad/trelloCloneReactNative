import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSupabase } from '@/context/SupabaseContext';
import { Board } from '@/types/enums';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import BoardArea from '@/components/Board/BoardArea';

const Page = () => {
  const { id, bg } = useLocalSearchParams<{ id: string; bg?: string }>();
  const { getBoardInfo } = useSupabase();
  const [board, setBoard] = useState<Board>();
  const { top } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    loadBoardInfo();
  }, [id]);

  const loadBoardInfo = async () => {
    if (!id) return;

    const data = await getBoardInfo!(id);
    setBoard(data);
  };

  const CustomHeader = () => (
    <BlurView intensity={80} tint={'dark'} style={{ paddingTop: top }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Ionicons name="close" size={24} color={Colors.fontLight} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: Colors.fontLight, fontSize: 16 }}>
            {board?.title}
          </Text>
          <Text style={{ color: Colors.fontLight, fontSize: 12 }}>
            Workspace of {(board as any)?.users.first_name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity>
            <Ionicons
              name="filter-circle-outline"
              size={26}
              color={Colors.fontLight}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={26}
              color={Colors.fontLight}
            />
          </TouchableOpacity>
          <Link href={`/(authenticated)/board/settings?id=${id}`} asChild>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={26}
                color={Colors.fontLight}
              />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </BlurView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: headerHeight }}>
      <Stack.Screen
        options={{
          title: board?.title,
          headerTransparent: true,
          header: () => <CustomHeader />,
        }}
      />
      {board && <BoardArea board={board} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    height: 50,
  },
});

export default Page;
