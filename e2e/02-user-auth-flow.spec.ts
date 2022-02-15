/* eslint-disable no-console */

import { test, expect } from '@playwright/test'
import { B } from 'bhala'

const USER_EMAIL = 'doris@sea.com'
const USER_PASSWORD = 'test'

test.describe('User Auth Flow', () => {
  test.beforeAll(async ({ request }) => {
    const resetResponse = await request.get('http://localhost:3000/api/reset')
    expect(resetResponse.ok()).toBeTruthy()

    const usersResponse = await request.get('http://localhost:3000/api/users')
    expect(usersResponse.ok()).toBeTruthy()
    const { data: users } = await usersResponse.json()
    expect(users).toHaveLength(0)
  })

  test('Sign Up, Log In & Log Out', async ({ page }) => {
    page.on('console', message => {
      B.log(`${message.type()} -`, message.text())
    })

    await page.goto('http://localhost:3000')

    const pageTitle = await page.textContent('h1')
    expect(pageTitle).toBe('Home')

    await page.click('data-test-id=header-signUpButton')

    await page.locator('data-test-id=modal-signUpTitle').waitFor()

    await page.fill('#email', USER_EMAIL)
    await page.fill('#password', USER_PASSWORD)
    const [signupResponse] = await Promise.all([
      page.waitForResponse('**/api/auth/signup'),
      page.click('data-test-id=modal-signUpButton'),
    ])
    expect(signupResponse.ok()).toBeTruthy()

    await page.locator('data-test-id=modal-logInTitle').waitFor()
    await page.fill('#email', USER_EMAIL)
    await page.fill('#password', USER_PASSWORD)
    const [loginResponse] = await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('data-test-id=modal-logInButton'),
    ])
    expect(loginResponse.ok()).toBeTruthy()

    page.click('data-test-id=header-logOutButton')
    const [logoutResponse] = await Promise.all([
      page.waitForResponse('**/api/auth/logout'),
      page.click('data-test-id=header-logOutButton'),
    ])
    expect(logoutResponse.ok()).toBeTruthy()

    await page.locator('data-test-id=header-logInButton').waitFor()
  })

  test('Log In & Log Out', async ({ page }) => {
    page.on('console', message => {
      B.log(`${message.type()} -`, message.text())
    })

    await page.goto('http://localhost:3000')

    const pageTitle = await page.textContent('h1')
    expect(pageTitle).toBe('Home')

    await page.click('data-test-id=header-logInButton')

    await page.locator('data-test-id=modal-logInTitle').waitFor()
    await page.fill('#email', USER_EMAIL)
    await page.fill('#password', USER_PASSWORD)
    const [loginResponse] = await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      page.click('data-test-id=modal-logInButton'),
    ])
    expect(loginResponse.ok()).toBeTruthy()

    const [logoutResponse] = await Promise.all([
      page.waitForResponse('**/api/auth/logout'),
      page.click('data-test-id=header-logOutButton'),
    ])
    expect(logoutResponse.ok()).toBeTruthy()

    await page.locator('data-test-id=header-logInButton').waitFor()
  })
})
