import { configureStore } from "@reduxjs/toolkit";
import { uiPreferencesReducer } from "../features/ui-preferences/slice";

export function createAppStore() {
  return configureStore({
    reducer: {
      uiPreferences: uiPreferencesReducer,
    },
  });
}

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
