import baseConfig from './vite.config'

export default {
  ...baseConfig,
  test: {
    ...baseConfig.test,
    include: [
      'src/pages/digital-human/DigitalHumansPage.alert-regression.test.tsx',
      'src/pages/digital-human/DigitalHumanVideoTasksPage.alert-regression.test.tsx',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
    passWithNoTests: false,
  },
}
