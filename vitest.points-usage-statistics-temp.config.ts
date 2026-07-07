import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      "src/api/points/usage/index.test.ts",
      "src/pages/points/PointsUsageStatisticsPage.test.tsx",
      "src/app/router/pointsRouteRegistry.test.ts",
      "src/app/router/pointsDynamicRoutes.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
