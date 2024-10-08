import {
  Button,
  FlatList,
  Image,
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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useSupabase } from '@/context/SupabaseContext';
import { Task, User } from '@/types/enums';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { DefaultTheme } from '@react-navigation/native';
import UserListItem from '@/components/UserListItem';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%'], []);

  const {
    getCardInfo,
    getBoardMember,
    getFileFromPath,
    updateCard,
    assignCard,
  } = useSupabase();

  const router = useRouter();
  const [card, setCard] = useState<Task>();
  const [member, setMember] = useState<User[]>([]);
  const [imagePath, setImagePath] = useState<string>('');

  if (card?.image_url) {
    getFileFromPath!(card.image_url).then(path => {
      if (path) {
        setImagePath(path);
      }
    });
  }

  useEffect(() => {
    if (!id) return;
    loadInfo();
  }, [id]);

  const loadInfo = async () => {
    if (!id) return;

    const data = await getCardInfo!(id);
    setCard(data);

    const member = await getBoardMember!(data.board_id);
    setMember(member);
  };

  const saveAndClose = () => {
    updateCard!(card!);
    router.back();
  };

  const onArchiveCard = () => {
    updateCard!({ ...card!, done: true });
    router.back();
  };

  const onAssignUser = async (user: User) => {
    const { data } = await assignCard!(card!.id, user.id);

    setCard(data);
    bottomSheetModalRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.2}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        {...props}
        onPress={() => bottomSheetModalRef.current?.close()}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={saveAndClose}>
                <Ionicons name="close" size={24} color={Colors.grey} />
              </TouchableOpacity>
            ),
          }}
        />
        {card && (
          <>
            {!card.image_url && (
              <TextInput
                value={card.title}
                onChangeText={text => setCard({ ...card, title: text })}
                style={styles.input}
                multiline
              />
            )}

            <TextInput
              value={card.description || ''}
              multiline
              onChangeText={text => setCard({ ...card, description: text })}
              style={[styles.input, { minHeight: 100 }]}
              placeholder="Add a description"
            />

            {imagePath && (
              <>
                {card.image_url && (
                  <Image source={{ uri: imagePath }} style={styles.image} />
                )}
              </>
            )}

            <View style={styles.memberContainer}>
              <Ionicons name="person" size={24} color={Colors.grey} />

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => bottomSheetModalRef.current?.present()}
              >
                {!card.assigned_to ? (
                  <Text>Assign...</Text>
                ) : (
                  <Text>
                    Assigned to {card.users?.first_name || card.users?.email}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btn} onPress={onArchiveCard}>
              <Text style={styles.btnText}>Archive</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enableOverDrag={false}
        enablePanDownToClose
        handleStyle={{
          backgroundColor: DefaultTheme.colors.background,
          borderRadius: 12,
        }}
      >
        <View style={styles.bottomContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
          >
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
            <FlatList
              data={member}
              keyExtractor={item => item.id}
              renderItem={item => (
                <UserListItem element={item} onPress={onAssignUser} />
              )}
              contentContainerStyle={{ gap: 8 }}
            />
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  memberContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 8,
    alignItems: 'center',
  },
  btn: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
  },
  btnText: {
    fontSize: 18,
  },
  bottomContainer: {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
    gap: 16,
  },
});

export default Page;
