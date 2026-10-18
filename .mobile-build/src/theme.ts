import { createContext, useContext } from 'react';
export const dark = {
  bg: '#0c0d10',
  surface: '#14161b',
  raised: '#1b1e25',
  line: '#292d36',
  text: '#eceef2',
  muted: '#9aa1ae',
  accent: '#c8f560',
  ink: '#0c0d10',
  soft: '#222c18',
  blue: '#8ecbff',
  amber: '#f5c26b',
  pink: '#f59bd0',
};
export const light: typeof dark = {
  bg: '#f6f5f0',
  surface: '#ffffff',
  raised: '#efeee7',
  line: '#deddd5',
  text: '#15171c',
  muted: '#5b616d',
  accent: '#4a7a0c',
  ink: '#ffffff',
  soft: '#e8efdb',
  blue: '#1f5fae',
  amber: '#935100',
  pink: '#a3226d',
};
export const ThemeContext = createContext(dark);
export const useTheme = () => useContext(ThemeContext);
export const fonts = {
  regular: 'InterTight_400Regular',
  medium: 'InterTight_500Medium',
  bold: 'InterTight_700Bold',
  mono: 'JetBrainsMono_400Regular',
};
