import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      "src/features/text-image-video/form.test.ts",
      "src/api/customer/text-image-video/index.test.ts",
      "src/pages/ImageVideoPage.test.tsx",
      "src/pages/TextImageVideoTaskDetailPage.test.tsx",
      "src/pages/TextImageVideoTasksPage.test.tsx",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
