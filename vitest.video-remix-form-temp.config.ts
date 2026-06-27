import baseConfig from "./vite.config";

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: ["src/features/video-remix/form.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.{idea,git,cache,output,temp}/**"],
    passWithNoTests: false,
  },
};
