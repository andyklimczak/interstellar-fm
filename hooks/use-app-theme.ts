import { useTheme } from 'expo-router';
import type { AppTheme } from '@/constants/theme';

// The app's two themes use hex strings, not native dynamic ColorValue objects.
export const useAppTheme = () => useTheme() as AppTheme;
