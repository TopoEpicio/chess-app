import { test, expect } from '@playwright/test'

test('loads Play page and shows game setup', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play' }).click()
  await expect(page.getByText('Scegli il tuo colore')).toBeVisible()
})

test('starts a game after selecting a color', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play' }).click()
  await page.getByRole('button', { name: 'Bianco' }).click()
  await expect(page.getByText('Nuova partita')).toBeVisible()
})
