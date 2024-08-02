import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TaskList } from '@/types/enums';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { DefaultTheme } from '@react-navigation/native';
import { useSupabase } from '@/context/SupabaseContext';

export interface ListViewProps {
  taskList: TaskList;
  onDelete: () => void;
}

const ListView = ({ taskList, onDelete }: ListViewProps) => {
  const [listName, setListName] = useState(taskList.title);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const { updateBoardList, deleteBoardList } = useSupabase();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  const onUpdateTaskList = async () => {
    const updated = await updateBoardList!(taskList, listName);
  };
  const onDeleteList = async () => {
    await deleteBoardList!(taskList.id);
    bottomSheetModalRef.current?.close();
    onDelete();
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.listContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.listTitle}>{listName}</Text>
            <TouchableOpacity
              onPress={() => bottomSheetModalRef.current?.present()}
            >
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={22}
                color={Colors.grey}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        handleStyle={styles.handle}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableOverDrag={false}
      >
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              title="Cancel"
              onPress={() => bottomSheetModalRef.current?.close()}
            />
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: Colors.grey, fontSize: 12, marginBottom: 5 }}>
              List name
            </Text>
            <TextInput
              value={listName}
              onChangeText={text => setListName(text)}
              style={{ fontSize: 16, color: Colors.fontDark }}
              returnKeyType="done"
              enterKeyHint="done"
              onEndEditing={onUpdateTaskList}
            />
          </View>
          <TouchableOpacity onPress={onDeleteList} style={styles.deleteBtn}>
            <Text>Close list</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#F3EFFC',
    borderRadius: 4,
    padding: 6,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
  },
  listTitle: {
    paddingVertical: 8,
    fontWeight: '500',
  },
  container: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
  handle: {
    backgroundColor: DefaultTheme.colors.background,
    borderRadius: 12,
  },
  deleteBtn: {
    backgroundColor: '#fff',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default ListView;
