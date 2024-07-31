import { Colors } from '@/constants/Colors';
import { ModalType } from '@/types/enums';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useCallback, useMemo, useRef, useState } from 'react';
import AuthModal from '@/components/AuthModal';

export default function Index() {
  const { top } = useSafeAreaInsets();
  const { showActionSheetWithOptions } = useActionSheet();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['33%'], []);
  const [authType, setAuthType] = useState<ModalType | null>(null);

  const openLink = () => {
    // Open User Notice link in the browser
    WebBrowser.openBrowserAsync('https://galaxies.dev');
  };

  const openActionSheet = async () => {
    const options = ['View support docs', 'Contact us', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Can't log in or sign up",
      },
      selectedIndex => {
        console.log(selectedIndex);
      }
    );
  };
  const showModal = async (type: ModalType) => {
    setAuthType(type);
    bottomSheetModalRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={() => bottomSheetModalRef.current?.close}
      />
    ),
    []
  );

  return (
    <BottomSheetModalProvider>
      <View style={[styles.container, { paddingTop: top + 30 }]}>
        <Image
          source={require('@/assets/images/login/trello.png')}
          style={styles.image}
        />
        <Text style={styles.introText}>
          Move teamwork forward - even on the go
        </Text>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#fff' }]}
            onPress={() => showModal(ModalType.Login)}
          >
            <Text style={[styles.btnText, { color: Colors.primary }]}>
              Log in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]}>
            <Text
              style={[styles.btnText, { color: '#fff' }]}
              onPress={() => showModal(ModalType.SignUp)}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            By signing up, you agree to the{' '}
            <Text style={styles.link} onPress={openLink}>
              User Notice{' '}
            </Text>
            and <Text style={styles.link}> Privacy Policy</Text>.
          </Text>
          <Text style={styles.link} onPress={openActionSheet}>
            Can't log in or sign up?
          </Text>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        handleComponent={null}
        enableOverDrag={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <AuthModal authType={authType} />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  image: {
    height: 450,
    paddingHorizontal: 40,
    resizeMode: 'contain',
  },
  introText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 17,
    padding: 30,
  },
  bottomContainer: {
    gap: 10,
    width: '100%',
    paddingHorizontal: 40,
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
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    marginHorizontal: 60,
  },
  link: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
