import { test, expect } from '@playwright/test'

test('login', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  const $loader = page.locator('#__next > div')
  await expect($loader).toHaveText('Loader')
})
