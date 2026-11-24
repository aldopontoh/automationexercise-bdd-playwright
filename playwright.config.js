const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.steps.js', 'fixtures/bddFixtures.js'],
  outputDir: '.features-gen',
});

module.exports = defineConfig({
  testDir,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  timeout: 90000,
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'https://automationexercise.com',
    testIdAttribute: 'data-test',
    actionTimeout: 15000,
    navigationTimeout: 45000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'bdd-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'bdd-firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'bdd-edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
