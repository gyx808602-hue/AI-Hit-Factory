import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemePalette = {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
};

export type ThemeSurfaces = {
  appBg: string;
  sidebarBg: string;
  cardBg: string;
  mutedBg: string;
  lineSubtle: string;
};

export type ThemeText = {
  primary: string;
  secondary: string;
  muted: string;
};

export type LayoutPreferences = {
  sidebarCollapsed: boolean;
};

export type UiPreferencesState = {
  theme: {
    palette: ThemePalette;
    surfaces: ThemeSurfaces;
    text: ThemeText;
  };
  layout: LayoutPreferences;
};

export const defaultUiPreferencesState: UiPreferencesState = {
  theme: {
    palette: {
      primary: "#7C5CFC",
      info: "#22D3EE",
      success: "#4ADE80",
      warning: "#F97316",
      error: "#EF4444",
    },
    surfaces: {
      appBg: "#0c0d14",
      sidebarBg: "#10111a",
      cardBg: "#13141f",
      mutedBg: "#1a1b28",
      lineSubtle: "rgba(255, 255, 255, 0.08)",
    },
    text: {
      primary: "#e8e9f0",
      secondary: "#b8b9cc",
      muted: "#6b6c80",
    },
  },
  layout: {
    sidebarCollapsed: false,
  },
};

const uiPreferencesSlice = createSlice({
  name: "uiPreferences",
  initialState: defaultUiPreferencesState,
  reducers: {
    setThemePalette(state, action: PayloadAction<Partial<ThemePalette>>) {
      state.theme.palette = {
        ...state.theme.palette,
        ...action.payload,
      };
    },
    setThemeSurfaces(state, action: PayloadAction<Partial<ThemeSurfaces>>) {
      state.theme.surfaces = {
        ...state.theme.surfaces,
        ...action.payload,
      };
    },
    setThemeText(state, action: PayloadAction<Partial<ThemeText>>) {
      state.theme.text = {
        ...state.theme.text,
        ...action.payload,
      };
    },
    resetTheme(state) {
      state.theme = defaultUiPreferencesState.theme;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.layout.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed(state) {
      state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed;
    },
  },
});

export const {
  resetTheme,
  setSidebarCollapsed,
  setThemePalette,
  setThemeSurfaces,
  setThemeText,
  toggleSidebarCollapsed,
} = uiPreferencesSlice.actions;

export const uiPreferencesReducer = uiPreferencesSlice.reducer;
