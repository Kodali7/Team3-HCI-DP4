const { test, expect } = require('@playwright/test');

async function setStock(page, name, stock) {
  await page.getByRole('tab', { name: 'Inventory', exact: true }).click();
  await page.getByLabel(`Edit ${name}`, { exact: true }).click();
  await page.getByLabel('Current stock', { exact: true }).fill(String(stock));
  await page.getByText('Save', { exact: true }).click();
}

async function openRestock(page) {
  await page.getByRole('tab', { name: 'Restock List', exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Truck Management', { exact: true })).toBeVisible();
});

test('empty list and exact minimum follow live inventory', async ({ page }) => {
  await openRestock(page);
  await expect(page.getByText("You're stocked up")).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send Order', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'View Inventory' }).click();
  await setStock(page, 'Onion', 9);
  await openRestock(page);
  await expect(page.getByText('needed: 1 lbs', { exact: true })).toBeVisible();
  await setStock(page, 'Onion', 10);
  await openRestock(page);
  await expect(page.getByText("You're stocked up")).toBeVisible();
});

test('add contact, validate, text, and preserve contact across tabs', async ({ page }) => {
  await setStock(page, 'Onion', 7);
  await openRestock(page);
  await page.getByRole('button', { name: 'Text List', exact: true }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
  await page.getByLabel('Name', { exact: true }).fill('Employee 3');
  await page.getByLabel('Phone', { exact: true }).fill('abc');
  await page.getByLabel('Email', { exact: true }).fill('invalid');
  await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
  await page.getByLabel('Phone', { exact: true }).fill('312-555-0103');
  await page.getByLabel('Email', { exact: true }).fill('employee3@example.com');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: 'Select Employee 3', exact: true }).click();
  await expect(page.getByText('Phone: 312-555-0103')).toBeVisible();
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(page.getByText('Text Sent!', { exact: true })).toBeVisible();
  await expect(page.getByText('Demo confirmation for 1 ingredient. Nothing was transmitted.')).toBeVisible();
  await page.screenshot({ path: 'test-results/contact-sent.png' });
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('current stock: 7 lbs', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'My Truck' }).click();
  await openRestock(page);
  await page.getByRole('button', { name: 'Text List', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Employee 3', exact: true })).toBeVisible();
});

test('new vendor, accurate order, notes, cancel, and send', async ({ page }) => {
  await setStock(page, 'Onion', 7);
  await setStock(page, 'Rice', 2);
  await openRestock(page);
  await page.screenshot({ path: 'test-results/restock-list.png' });
  await page.getByRole('button', { name: 'Send Order', exact: true }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Vendor 3');
  await page.getByLabel('Phone', { exact: true }).fill('312-555-0113');
  await page.getByLabel('Email', { exact: true }).fill('vendor3@example.com');
  await page.screenshot({ path: 'test-results/new-vendor.png' });
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('button', { name: 'Select Vendor 3', exact: true }).click();
  await page.getByRole('button', { name: 'Order', exact: true }).click();
  await expect(page.getByText('Onion: 3 lbs', { exact: true })).toBeVisible();
  await expect(page.getByText('Rice: 3 bags', { exact: true })).toBeVisible();
  await expect(page.getByText('Chicken:', { exact: false })).toHaveCount(0);
  await page.getByLabel('Order note').fill('Deliver before lunch.');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByText('Order Sent!', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Order', exact: true }).click();
  await expect(page.getByLabel('Order note')).toHaveValue('Deliver before lunch.');
  await page.screenshot({ path: 'test-results/order-preview.png' });
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('Order Sent!', { exact: true })).toBeVisible();
  await expect(page.getByText('Note: Deliver before lunch.')).toBeVisible();
  await page.screenshot({ path: 'test-results/order-sent.png' });
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('current stock: 7 lbs', { exact: true })).toBeVisible();
  await expect(page.getByText('current stock: 2 bags', { exact: true })).toBeVisible();
});

test('cancel addition and confirm deletion without touching vendors', async ({ page }) => {
  await setStock(page, 'Onion', 9);
  await openRestock(page);
  await page.getByRole('button', { name: 'Text List', exact: true }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Discarded');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Discarded' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Select Employee 1', exact: true }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByText('Phone: 312-555-0101')).toBeVisible();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Employee 1', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Send Order', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Select Vendor 1', exact: true })).toBeVisible();
});

test('small screen keeps order actions reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await setStock(page, 'Onion', 9);
  await openRestock(page);
  await page.getByRole('button', { name: 'Send Order', exact: true }).click();
  await page.getByRole('button', { name: 'Select Vendor 1', exact: true }).click();
  await page.getByRole('button', { name: 'Order', exact: true }).click();
  await page.getByLabel('Order note').fill('A note for a small screen.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByText('Order Sent!', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/small-screen.png' });
});
