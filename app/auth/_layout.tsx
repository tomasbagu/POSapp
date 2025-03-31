import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
      </Stack>
    </AuthProvider>);
}