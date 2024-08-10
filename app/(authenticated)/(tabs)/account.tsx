import { useAuth } from '@clerk/clerk-expo';
import { View, Button } from 'react-native';
const Page = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
};
export default Page;
