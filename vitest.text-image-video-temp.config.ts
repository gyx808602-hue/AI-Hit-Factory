import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      "src/features/text-image-video/form.test.ts",
      "src/api/customer/text-image-video/index.test.ts",
      "src/pages/content/ImageVideoPage.test.tsx",
      "src/pages/content/TextImageVideoTaskDetailPage.test.tsx",
      "src/pages/content/TextImageVideoTasksPage.test.tsx",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
