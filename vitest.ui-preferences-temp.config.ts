import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      "src/features/ui-preferences/slice.test.ts",
      "src/features/ui-preferences/ThemeCssVariables.test.tsx",
      "src/app/layouts/DashboardLayout.test.tsx",
      "src/app/App.ui-preferences.test.tsx",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
