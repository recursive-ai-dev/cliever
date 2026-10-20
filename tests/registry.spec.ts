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
    // Default page shows 12 agent cards (itemsPerPage = 12)
    const cards = page.locator('main .grid h3');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBe(12);
    await expect(page.getByText(/^Showing 1–12 of \d+ tools$/)).toBeVisible();
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
    expect(await cards.count()).toBe(12);
  });

  test('empty search shows an empty state that clears filters', async ({ page }) => {
    const search = page.getByPlaceholder('SEARCH_REGISTRY_METADATA...');
    await search.fill('zzzz-no-such-tool');
    await expect(page.getByText('No tools match your filters.')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).last().click();
    await expect(search).toHaveValue('');
    expect(await page.locator('main .grid h3').count()).toBe(12);
  });

  test('"/" focuses the registry search', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('/');
    await expect(page.getByPlaceholder('SEARCH_REGISTRY_METADATA...')).toBeFocused();
  });

  test('cards open with the keyboard', async ({ page }) => {
    const first = page.locator('main .grid h3 button').first();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Mission Profile')).toBeVisible();
  });

  test('archived upstream projects are flagged', async ({ page }) => {
    await page.getByPlaceholder('SEARCH_REGISTRY_METADATA...').fill('gpt-engineer');
    const card = page.locator('main .grid > div').filter({ hasText: 'gpt-engineer' }).first();
    await expect(card.getByText('ARCHIVED')).toBeVisible();
  });

  test('pagination advances and retreats', async ({ page }) => {
    await expect(page.getByText('SECTOR')).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    await page.getByRole('button', { name: 'Previous page' }).click();
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });
});

test.describe('install commands', () => {
  test('copy button copies the stored command exactly', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard read permission is Chromium-only in Playwright');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByPlaceholder('SEARCH_REGISTRY_METADATA...').fill('claude code');
    await page.getByRole('button', { name: 'Copy install command for Claude Code' }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe('curl -fsSL https://claude.ai/install.sh | bash');
  });

  test('bundle comments out manual (non-command) steps', async ({ page }) => {
    // Jan's Linux entry is a manual download step, not a shell command.
    await page.getByPlaceholder('SEARCH_REGISTRY_METADATA...').fill('jan');
    const card = page.locator('main .grid > div').filter({ has: page.getByRole('button', { name: 'View details for Jan' }) });
    await card.getByRole('button', { name: 'Add to bundle' }).click();
    await page.getByRole('button', { name: 'Take bundle' }).click();
    const dialog = page.getByRole('dialog', { name: 'Take bundle' });
    await dialog.getByRole('button', { name: /Linux/ }).click();
    await expect(dialog.getByText(/# Manual step: Download AppImage from jan\.ai/)).toBeVisible();
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
  const send = async (page: import('@playwright/test').Page, text: string) => {
    const input = page.getByPlaceholder('QUERY_REGISTRY...');
    await input.fill(text);
    await input.press('Enter');
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  };

  test('system chat answers via the local engine', async ({ page }) => {
    await page.getByRole('button', { name: /Open system chat/i }).click();
    await send(page, 'how do I install these tools?');
    // Local engine response arrives (Expert Analysis document)
    await expect(page.getByText(/Expert Analysis/i)).toBeVisible({ timeout: 15000 });
  });

  test('registry questions are answered from the registry', async ({ page }) => {
    await page.getByRole('button', { name: /Open system chat/i }).click();
    await send(page, 'find me a coding agent');
    await expect(page.getByText(/Matching tools/i)).toBeVisible({ timeout: 15000 });
  });

  test('Kira greets and remembers what you tell her', async ({ page }) => {
    await page.getByRole('button', { name: /Open system chat/i }).click();
    await send(page, 'hello');
    await expect(page.getByText(/call you|on your mind|talk about/i).first()).toBeVisible({ timeout: 30000 });
    await send(page, 'I like docker');
    await expect(page.getByText(/remember that/i)).toBeVisible({ timeout: 15000 });
    await send(page, 'what do you remember about me');
    await expect(page.getByText(/Here.s what you.ve told me/i)).toBeVisible({ timeout: 15000 });
  });
});

test.describe('chat drives the app', () => {
  const send = async (page: import('@playwright/test').Page, text: string) => {
    const input = page.getByPlaceholder('QUERY_REGISTRY...');
    await input.fill(text);
    await input.press('Enter');
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  };

  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: /Open system chat/i }).click();
  });

  test('search, sort and clear filters act on the registry', async ({ page }) => {
    const search = page.getByLabel('Search registry');
    await send(page, 'search for lazygit');
    await expect(search).toHaveValue('lazygit');
    await expect(page.getByText(/Searching the registry for “lazygit”/)).toBeVisible();

    await send(page, 'sort by name');
    await expect(page.getByLabel('Sort agents')).toHaveValue('Name (A-Z)');

    await send(page, 'clear filters');
    await expect(search).toHaveValue('');
  });

  test('the theme changes and the selector follows', async ({ page }) => {
    const accent = () => page.evaluate(() => document.documentElement.style.getPropertyValue('--accent'));
    const before = await accent();
    await send(page, 'use the synthwave theme');
    await expect(page.getByText(/Theme set to Synthwave/)).toBeVisible();
    expect(await accent()).not.toBe(before);
  });

  test('panels open and close from chat', async ({ page }) => {
    await send(page, 'open mission control');
    const heading = page.getByRole('heading', { name: 'MISSION CONTROL' });
    await expect(heading).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(heading).toBeHidden();
  });

  test('queueing two tools and opening the comparison works end to end', async ({ page }) => {
    await send(page, 'open comparison');
    await expect(page.getByText(/needs two tools/)).toBeVisible();
    await send(page, 'open comparison of lazygit and lazydocker');
    await expect(page.getByText('AGENT COMPARISON ENGINE')).toBeVisible();
    await page.getByRole('button', { name: 'Close comparison' }).click();
  });

  test('app terminology is explained', async ({ page }) => {
    await send(page, 'what is a squad');
    await expect(page.getByText(/Recruit to squad/).first()).toBeVisible({ timeout: 15000 });
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
    const dialog = page.getByRole('dialog', { name: 'Take bundle' });
    await expect(dialog.getByText('TAKE_BUNDLE')).toBeVisible();
    await expect(dialog.getByText('BUNDLE_OUTPUT')).toBeVisible();
    await expect(dialog.getByText(/1 command saved/)).toBeVisible();
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
