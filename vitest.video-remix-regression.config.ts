import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      "src/api/aigc/video-remix-tasks/index.test.ts",
      "src/pages/ViralRemixPage.test.tsx",
      "src/pages/VideoRemixTasksPage.test.tsx",
      "src/pages/VideoRemixTaskDetailPage.test.tsx",
      "src/features/video-remix/status.test.ts",
      "src/features/video-remix/form.test.ts",
      "src/app/router/routeRegistry.test.ts",
      "src/app/router/dynamicRoutes.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
