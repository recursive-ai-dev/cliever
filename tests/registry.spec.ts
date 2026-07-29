import { test, expect } from '@playwright/test';

/**
 * CLI-Verse end-to-end smoke tests.
 *
 * Covers the primary user flows from TESTING.md against the production
 * build (vite preview): platform gate, registry grid, search/filter,
 * pagination, detail modal + reviews, chat, comparison, squad/collaboration,
 * bundles, shell command generator, telemetry, and themes.
 *
 * All network-independent: the local model, checkpoints, and registry data
 * are served from the bundle itself.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Complete the platform gate: deterministic choice (Linux).
  await page.getByRole('button', { name: /Linux/i }).first().click();
  await expect(page.getByPlaceholder('SEARCH_REGISTRY_METADATA...')).toBeVisible();
});

test.describe('registry discovery', () => {
  test('grid renders agents after platform selection', async ({ page }) => {
    // Default page shows 6 agent cards (itemsPerPage = 6)
    const cards = page.locator('main .grid h3');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBe(6);
  });

  test('search filters the grid', async ({ page }) => {
    const search = page.getByPlaceholder('SEARCH_REGISTRY_METADATA...');
    await search.fill('ollama');
    const cards = page.locator('main .grid h3');
    await expect(cards.first()).toBeVisible();
    const names = await cards.allTextContents();
    expect(names.some(n => /ollama/i.test(n))).toBe(true);
  });

  test('category filter narrows results and resets', async ({ page }) => {
    await page.getByRole('button', { name: 'GIT TOOL' }).click();
    const cards = page.locator('main .grid h3');
    await expect(cards.first()).toBeVisible();
    const all = page.getByRole('button', { name: 'ALL', exact: true });
    await all.click();
    expect(await cards.count()).toBe(6);
  });

  test('pagination advances and retreats', async ({ page }) => {
    await expect(page.getByText('SECTOR')).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    await page.getByRole('button', { name: 'Previous page' }).click();
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });
});

test.describe('agent detail', () => {
  test('opens detail layer and closes via Escape', async ({ page }) => {
    await page.locator('main .grid h3').first().click();
    await expect(page.getByText('Mission Profile')).toBeVisible();
    await expect(page.getByText('Provenance & Verification')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByText('Mission Profile')).toBeHidden();
  });

  test('review submission persists and can be deleted', async ({ page }) => {
    await page.locator('main .grid h3').first().click();
    await page.getByRole('button', { name: 'Add Review' }).click();
    await page.getByPlaceholder('Operative Name').fill('e2e-tester');
    await page.getByPlaceholder('Transmission content...').fill('Solid registry entry.');
    await page.getByRole('button', { name: 'Transmit' }).click();
    await expect(page.getByText('e2e-tester')).toBeVisible();
    // Delete the review again
    await page.getByRole('button', { name: /Delete review by e2e-tester/ }).click();
    await expect(page.getByText('e2e-tester')).toBeHidden();
  });

  test('local model analysis renders as formatted document', async ({ page }) => {
    await page.locator('main .grid h3').first().click();
    await page.getByRole('button', { name: 'Generate Intel' }).click();
    await expect(page.getByText('Technical Analysis').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Key Capabilities').first()).toBeVisible();
  });
});

test.describe('chat', () => {
  test('system chat answers via the local engine', async ({ page }) => {
    await page.getByRole('button', { name: /Open system chat/i }).click();
    const input = page.getByPlaceholder('QUERY_REGISTRY...');
    await input.fill('how do I install these tools?');
    await input.press('Enter');
    // User bubble visible
    await expect(page.getByText('how do I install these tools?')).toBeVisible();
    // Local engine response arrives (Expert Analysis document)
    await expect(page.getByText(/Expert Analysis/i)).toBeVisible({ timeout: 15000 });
  });
});

test.describe('comparison', () => {
  test('two agents can be queued and analyzed', async ({ page }) => {
    const grid = page.locator('main .grid');
    await grid.getByRole('button', { name: 'Add to comparison' }).nth(0).click();
    await grid.getByRole('button', { name: 'Add to comparison' }).nth(1).click();
    await page.getByRole('button', { name: 'Analyze' }).click();
    await expect(page.getByText('AGENT COMPARISON ENGINE')).toBeVisible();
    await expect(page.getByText('Comparison Analysis').first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Close comparison' }).click();
    await expect(page.getByText('AGENT COMPARISON ENGINE')).toBeHidden();
  });
});

test.describe('squad / mission control', () => {
  test('recruit agents and run a collaboration simulation', async ({ page }) => {
    const grid = page.locator('main .grid');
    await grid.getByRole('button', { name: 'Recruit to squad' }).nth(0).click();
    await grid.getByRole('button', { name: 'Recruit to squad' }).nth(1).click();
    await page.getByRole('button', { name: /Open Mission Control \(2 agents in squad\)/i }).click();
    await expect(page.getByText('MISSION CONTROL')).toBeVisible();
    await page.getByPlaceholder(/Describe the task for the squad/).fill('Build a CLI release pipeline');
    await page.getByRole('button', { name: /Execute/i }).click();
    await expect(page.getByText(/Squad Collaboration Plan/i)).toBeVisible({ timeout: 15000 });
    await page.keyboard.press('Escape');
  });
});

test.describe('bundle', () => {
  test('add agents to bundle and view command output', async ({ page }) => {
    const grid = page.locator('main .grid');
    await grid.getByRole('button', { name: 'Add to bundle' }).first().click();
    await page.getByRole('button', { name: 'Take bundle' }).click();
    await expect(page.getByText('TAKE_BUNDLE')).toBeVisible();
    await expect(page.getByText('BUNDLE_OUTPUT')).toBeVisible();
    await expect(page.getByText(/1 command saved/)).toBeVisible();
    await page.keyboard.press('Escape');
  });
});

test.describe('system tools', () => {
  test('shell command generator produces a command from natural language', async ({ page }) => {
    await page.getByRole('button', { name: /Open shell command generator/i }).click();
    const input = page.getByPlaceholder(/Find all PDF files/);
    await input.fill('find all pdf files modified in the last 7 days');
    await input.press('Enter');
    await expect(page.getByText('Generated Command').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/find \. -type f/)).toBeVisible();
  });

  test('telemetry dashboard opens and shows health metrics', async ({ page }) => {
    await page.getByRole('button', { name: /Open system telemetry/i }).click();
    await expect(page.getByRole('dialog', { name: 'System telemetry' })).toBeVisible();
    await expect(page.getByText('Production readiness breakdown')).toBeVisible();
    await page.getByRole('button', { name: 'Close telemetry' }).click();
    await expect(page.getByRole('dialog', { name: 'System telemetry' })).toBeHidden();
  });

  test('theme selector lists and applies themes', async ({ page }) => {
    await page.getByRole('button', { name: 'Select theme' }).click();
    await expect(page.getByRole('listbox', { name: 'Theme options' })).toBeVisible();
    await page.getByRole('option', { name: /M4trix/ }).click();
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    );
    expect(accent).toBe('#00ff00');
  });

  test('platform can be changed from the nav control', async ({ page }) => {
    await page.getByRole('button', { name: /Change platform/i }).click();
    await expect(page.getByText('Select Architecture')).toBeVisible();
    await page.getByRole('button', { name: /macOS/i }).first().click();
    await expect(page.getByPlaceholder('SEARCH_REGISTRY_METADATA...')).toBeVisible();
  });
});
