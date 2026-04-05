import { test, expect } from '@playwright/test'

test('login page loads correctly', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveTitle(/Fluxoo Solar/)
})
