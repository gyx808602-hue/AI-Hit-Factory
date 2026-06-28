import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      "src/pages/DigitalHumanVideoTasksPage.test.tsx",
      "src/features/digital-human/video/canvas.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
