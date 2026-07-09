import { describe, expect, it } from "vitest";
import {
  resetTheme,
  setSidebarCollapsed,
  setThemePalette,
  toggleSidebarCollapsed,
  uiPreferencesReducer,
} from "./slice";
import {
  selectAntdThemeConfig,
  selectSidebarCollapsed,
  selectThemeCssVariables,
  selectUiPreferences,
} from "./selectors";
import { createAppStore } from "../../app/store";

describe("uiPreferences slice", () => {
  it("initializes the default workspace theme and layout preferences", () => {
    const store = createAppStore();
    const state = store.getState();

    expect(selectUiPreferences(state)).toMatchObject({
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
    });
  });

  it("updates theme palette and can reset it to defaults", () => {
    const changed = uiPreferencesReducer(
      undefined,
      setThemePalette({ primary: "#0052CC", warning: "#FFAB00" }),
    );

    expect(changed.theme.palette.primary).toBe("#0052CC");
    expect(changed.theme.palette.warning).toBe("#FFAB00");
    expect(changed.theme.palette.info).toBe("#22D3EE");

    const reset = uiPreferencesReducer(changed, resetTheme());

    expect(reset.theme.palette.primary).toBe("#7C5CFC");
    expect(reset.theme.palette.warning).toBe("#F97316");
  });

  it("toggles and sets the sidebar collapsed layout preference", () => {
    const collapsed = uiPreferencesReducer(undefined, toggleSidebarCollapsed());

    expect(collapsed.layout.sidebarCollapsed).toBe(true);

    const expanded = uiPreferencesReducer(collapsed, setSidebarCollapsed(false));

    expect(expanded.layout.sidebarCollapsed).toBe(false);
  });

  it("derives Ant Design theme tokens from semantic Redux theme values", () => {
    const store = createAppStore();
    const themeConfig = selectAntdThemeConfig(store.getState());

    expect(themeConfig.token).toMatchObject({
      colorPrimary: "#7C5CFC",
      colorInfo: "#22D3EE",
      colorSuccess: "#4ADE80",
      colorWarning: "#F97316",
      colorError: "#EF4444",
      colorBgBase: "#0c0d14",
      colorBgContainer: "#13141f",
      colorBgElevated: "#1a1b28",
      colorTextBase: "#e8e9f0",
      borderRadius: 8,
    });
  });

  it("derives CSS variables for the whole application shell", () => {
    const store = createAppStore();

    expect(selectThemeCssVariables(store.getState())).toMatchObject({
      "--brand-primary": "#7C5CFC",
      "--brand-info": "#22D3EE",
      "--brand-warning": "#F97316",
      "--app-bg": "#0c0d14",
      "--sidebar-bg": "#10111a",
      "--card-bg": "#13141f",
      "--muted-bg": "#1a1b28",
      "--line-subtle": "rgba(255, 255, 255, 0.08)",
      "--text-primary": "#e8e9f0",
      "--text-secondary": "#b8b9cc",
      "--text-muted": "#6b6c80",
    });
  });

  it("selects sidebar collapsed from the app store", () => {
    const store = createAppStore();

    expect(selectSidebarCollapsed(store.getState())).toBe(false);

    store.dispatch(toggleSidebarCollapsed());

    expect(selectSidebarCollapsed(store.getState())).toBe(true);
  });
});
