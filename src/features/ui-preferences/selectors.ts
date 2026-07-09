import { createSelector } from "@reduxjs/toolkit";
import { theme, type ThemeConfig } from "antd";
import type { RootState } from "../../app/store";
import type { UiPreferencesState } from "./slice";

function removeHexPrefix(value: string) {
  return value.startsWith("#") ? value.slice(1) : value;
}

function hexToRgbTriplet(value: string) {
  const hex = removeHexPrefix(value);

  if (hex.length !== 6) {
    return "124, 92, 252";
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
    return "124, 92, 252";
  }

  return `${red}, ${green}, ${blue}`;
}

export function selectUiPreferences(state: RootState): UiPreferencesState {
  return state.uiPreferences;
}

export function selectSidebarCollapsed(state: RootState) {
  return selectUiPreferences(state).layout.sidebarCollapsed;
}

export const selectAntdThemeConfig = createSelector(
  selectUiPreferences,
  ({ theme: uiTheme }): ThemeConfig => {
    const { palette, surfaces, text } = uiTheme;

    return {
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: palette.primary,
        colorInfo: palette.info,
        colorSuccess: palette.success,
        colorWarning: palette.warning,
        colorError: palette.error,
        colorBgBase: surfaces.appBg,
        colorBgContainer: surfaces.cardBg,
        colorBgElevated: surfaces.mutedBg,
        colorBorder: surfaces.lineSubtle,
        colorTextBase: text.primary,
        borderRadius: 8,
        fontFamily:
          "Inter, Microsoft YaHei, PingFang SC, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      },
      components: {
        Button: {
          controlHeight: 36,
          borderRadius: 8,
        },
        Card: {
          colorBgContainer: surfaces.cardBg,
        },
        Table: {
          colorBgContainer: surfaces.cardBg,
          colorFillAlter: "rgba(255,255,255,0.02)",
        },
      },
    };
  },
);

export const selectThemeCssVariables = createSelector(
  selectUiPreferences,
  ({ theme: uiTheme }): Record<string, string> => {
    const { palette, surfaces, text } = uiTheme;
    const primaryRgb = hexToRgbTriplet(palette.primary);

    return {
      "--brand-primary": palette.primary,
      "--brand-info": palette.info,
      "--brand-success": palette.success,
      "--brand-warning": palette.warning,
      "--brand-error": palette.error,
      "--brand-primary-rgb": primaryRgb,
      "--brand-primary-active": `rgba(${primaryRgb.replaceAll(" ", "")},0.16)`,
      "--brand-primary-border": `rgba(${primaryRgb.replaceAll(" ", "")},0.35)`,
      "--brand-primary-hover": "#9B7FFF",
      "--brand-gradient": `linear-gradient(135deg,${palette.primary},${palette.warning})`,
      "--app-bg": surfaces.appBg,
      "--sidebar-bg": surfaces.sidebarBg,
      "--card-bg": surfaces.cardBg,
      "--muted-bg": surfaces.mutedBg,
      "--line-subtle": surfaces.lineSubtle,
      "--text-primary": text.primary,
      "--text-secondary": text.secondary,
      "--text-muted": text.muted,
    };
  },
);
