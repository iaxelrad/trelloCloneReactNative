import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Board, TaskList, TaskListFake } from '@/types/enums';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useSupabase } from '@/context/SupabaseContext';
import { Colors } from '@/constants/Colors';
import ListStart from './ListStart';
import { useSharedValue } from 'react-native-reanimated';
import ListView from './ListView';

export interface BoardAreaProps {
  board?: Board;
}

const BoardArea = ({ board }: BoardAreaProps) => {
  const { width, height } = useWindowDimensions();
  const ref = useRef<ICarouselInstance>(null);
  const { getBoardLists, addBoardList } = useSupabase();
  const [data, setData] = useState<Array<TaskList | TaskListFake>>([
    { id: undefined },
  ]);
  const [startListActive, setStartListActive] = useState(false);
  const progress = useSharedValue<number>(0);
  const scrollOffsetValue = useSharedValue<number>(0);

  useEffect(() => {
    loadBoardLists();
  }, []);

  const loadBoardLists = async () => {
    if (!board) return;
    const lists = await getBoardLists!(board.id);
    // Add our fake item to the end of the list
    setData([...lists, { id: undefined }]);
  };

  const onSaveNewList = async (title: any) => {
    setStartListActive(false);
    const { data: newItem } = await addBoardList!(board!.id, title);
    data.pop();
    // Add our fake item to the end of the list
    setData([...data, newItem, { id: undefined }]);
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({ count: index - progress.value, animated: true });
  };

  const onListDeleted = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Carousel
        data={data}
        width={width}
        height={height}
        loop={false}
        ref={ref}
        pagingEnabled
        onProgressChange={progress}
        defaultScrollOffsetValue={scrollOffsetValue}
        renderItem={({ item, index }: any) => (
          <>
            {item.id && (
              <ListView
                taskList={item}
                key={index}
                onDelete={() => onListDeleted(item.id)}
              />
            )}
            {item.id === undefined && (
              <View
                key={index}
                style={{ paddingTop: 20, paddingHorizontal: 30 }}
              >
                {startListActive ? (
                  <ListStart
                    onCancel={() => setStartListActive(false)}
                    onSave={onSaveNewList}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.listAddBtn}
                    onPress={() => setStartListActive(true)}
                  >
                    <Text style={{ color: Colors.fontLight, fontSize: 18 }}>
                      Add list
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: '#ffffff5c', borderRadius: 40 }}
        size={8}
        activeDotStyle={{ backgroundColor: '#fff' }}
        containerStyle={{ gap: 10, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listAddBtn: {
    backgroundColor: '#00000047',
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BoardArea;
