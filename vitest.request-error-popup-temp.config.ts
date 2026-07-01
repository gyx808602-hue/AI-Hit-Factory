import baseConfig from './vite.config'

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      'src/pages/DigitalHumansPage.alert-regression.test.tsx',
      'src/pages/DigitalHumanVideoTasksPage.alert-regression.test.tsx',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
    passWithNoTests: false,
  },
}
