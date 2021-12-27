import { PlaywrightTestConfig, devices } from '@playwright/test'

const { CI } = process.env
const IS_CI = Boolean(CI)

const config: PlaywrightTestConfig = {
  forbidOnly: true,
  projects: [
    {
      name: 'chrome-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  retries: IS_CI ? 2 : 0,
  testDir: '../e2e',
  use: {
    trace: 'on-first-retry',
  },
}

export default config
