import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Theme } from '../../type/types';

interface ThemeState {
  currentTheme: Theme;
}

// Load theme from localStorage
const loadThemeFromStorage = (): Theme => {
  try {
    const stored = localStorage.getItem('movieAppTheme');
    return (stored as Theme) || 'dark';
  } catch (error) {
    console.error('Error loading theme from localStorage:', error);
    return 'dark';
  }
};

// Save theme to localStorage
const saveThemeToStorage = (theme: Theme) => {
  try {
    localStorage.setItem('movieAppTheme', theme);
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};

// Apply theme to document
const applyThemeToDocument = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const initialState: ThemeState = {
  currentTheme: loadThemeFromStorage(),
};

// Apply initial theme
applyThemeToDocument(initialState.currentTheme);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      saveThemeToStorage(state.currentTheme);
      applyThemeToDocument(state.currentTheme);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      saveThemeToStorage(state.currentTheme);
      applyThemeToDocument(state.currentTheme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;