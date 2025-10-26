/**
 * Tomorrow color palettes (light and night variants).
 */

import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

export const lightPalette = {
  background: '#ffffff',
  currentLine: '#efefef',
  selection: '#d6d6d6',
  foreground: '#4d4d4c',
  comment: '#8e908c',
  red: '#c82829',
  orange: '#f5871f',
  yellow: '#eab700',
  green: '#718c00',
  aqua: '#3e999f',
  blue: '#4271ae',
  purple: '#8959a8',
};

export const darkPalette = {
  background: '#2d2d2d',
  currentLine: '#393939',
  selection: '#515151',
  foreground: '#cccccc',
  comment: '#999999',
  red: '#f2777a',
  orange: '#f99157',
  yellow: '#ffcc66',
  green: '#99cc99',
  aqua: '#66cccc',
  blue: '#6699cc',
  purple: '#cc99cc',
};

export const Colors = {
  light: {
    text: lightPalette.foreground,
    background: lightPalette.background,
    tint: lightPalette.blue,
    icon: lightPalette.comment,
    tabIconDefault: lightPalette.comment,
    tabIconSelected: lightPalette.blue,
  },
  dark: {
    text: darkPalette.foreground,
    background: darkPalette.background,
    tint: darkPalette.aqua,
    icon: darkPalette.comment,
    tabIconDefault: darkPalette.comment,
    tabIconSelected: darkPalette.aqua,
  },
};

export const TomorrowLightTheme: Theme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: lightPalette.blue,
    background: lightPalette.background,
    card: '#ffffff',
    text: lightPalette.foreground,
    border: lightPalette.selection,
    notification: lightPalette.red,
  },
};

export const TomorrowDarkTheme: Theme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: darkPalette.aqua,
    background: darkPalette.background,
    card: darkPalette.currentLine,
    text: darkPalette.foreground,
    border: darkPalette.selection,
    notification: darkPalette.orange,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
