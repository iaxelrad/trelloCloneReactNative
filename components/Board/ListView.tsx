import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Task, TaskList } from '@/types/enums';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { DefaultTheme } from '@react-navigation/native';
import { useSupabase } from '@/context/SupabaseContext';
import DraggableFlatList, {
  DragEndParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import ListItem from './ListItem';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@clerk/clerk-expo';

export interface ListViewProps {
  taskList: TaskList;
  onDelete: () => void;
}

const ListView = ({ taskList, onDelete }: ListViewProps) => {
  const [listName, setListName] = useState(taskList.title);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    loadListTasks();
    const subscription = getRealtimeCardSubscription!(
      taskList.id,
      handleRealtimeChanges
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const {
    updateBoardList,
    deleteBoardList,
    getListCards,
    addListCard,
    updateCard,
    getRealtimeCardSubscription,
    uploadFile,
  } = useSupabase();

  const handleRealtimeChanges = (
    update: RealtimePostgresChangesPayload<any>
  ) => {
    console.log('REALTIME UPDATE:', update);
    const record = update.new?.id ? update.new : update.old;
    const event = update.eventType;

    if (!record) return;

    switch (event) {
      case 'INSERT':
        setTasks(prev => {
          return [...prev, record];
        });
        break;
      case 'UPDATE':
        setTasks(prev => {
          return prev
            .map(task => {
              if (task.id === record.id) {
                return record;
              }
              return task;
            })
            .filter(task => !task.done)
            .sort((a, b) => a.position - b.position);
        });
        break;
      case 'DELETE':
        setTasks(prev => {
          return prev.filter(task => task.id !== record.id);
        });
        break;
      default:
        console.log('Unhandled event type: ', event);
        break;
    }
  };

  const loadListTasks = async () => {
    const cards = await getListCards!(taskList.id);
    setTasks(cards);
  };

  const onAddCard = async () => {
    const { data } = await addListCard!(
      taskList.id,
      taskList.board_id,
      newTask,
      tasks.length
    );
    setIsAdding(false);
    setNewTask('');
    // setTasks([...tasks, data]);
  };

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
    await updateBoardList!(taskList, listName);
  };
  const onDeleteList = async () => {
    await deleteBoardList!(taskList.id);
    bottomSheetModalRef.current?.close();
    onDelete();
  };

  const onTaskDropped = async (params: DragEndParams<Task>) => {
    console.log('onTaskDropped', params);
    const newData = params.data.map((item, index) => {
      return {
        ...item,
        position: index,
      };
    });
    setTasks(newData);

    newData.forEach(async item => {
      await updateCard!(item);
    });
  };

  const onSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: 'base64',
      });
      const fileName = `${new Date().getTime()}-${userId}.${
        img.type === 'image' ? 'png' : 'mp4'
      }`;
      const filePath = `${taskList.board_id}/${fileName}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
      const storagePath = await uploadFile!(filePath, base64, contentType);

      if (storagePath) {
        addListCard!(
          taskList.id,
          taskList.board_id,
          fileName,
          tasks.length,
          storagePath
        );
      }
    }
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

          <DraggableFlatList
            data={tasks}
            keyExtractor={item => item.id}
            renderItem={ListItem}
            containerStyle={{
              paddingBottom: 4,
              maxHeight: '80%',
            }}
            contentContainerStyle={{ gap: 4 }}
            onDragEnd={onTaskDropped}
            onDragBegin={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
            onPlaceholderIndexChange={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          />

          {isAdding ? (
            <TextInput
              autoFocus
              style={styles.input}
              value={newTask}
              onChangeText={setNewTask}
            />
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 8,
              marginVertical: 8,
            }}
          >
            {!isAdding ? (
              <>
                <TouchableOpacity
                  onPress={() => setIsAdding(true)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Ionicons name="add" size={14} />
                  <Text style={{ fontSize: 12 }}>Add card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={onSelectImage}
                >
                  <Ionicons name="image-outline" size={18} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => setIsAdding(false)}>
                  <Text style={{ fontSize: 14, color: Colors.primary }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddCard}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
  input: {
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.2,
    borderRadius: 4,
  },
});

export default ListView;
