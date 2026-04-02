import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
});

test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success');
    //await successButton.click();

    //const text = await successButton.textContent();
    //await successButton.waitFor({ state: "attached" });
    //const text = await successButton.allTextContents();
    // await expect(text).toEqual("Data loaded with AJAX get request.")
    await expect(successButton).toHaveText("Data loaded with AJAX get request.", { timeout: 20000 });
});

test('alternative waites', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    // -----Wait for element-----------
    //await page.waitForSelector(".bg-success");

    // -----Wait for particular response-----------
    //await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

    // -----Wait for network calls to be completed (NOT RECOMMENDED)-----------
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for 5 seconds

    await page.waitForURL('https://google.com');

    const text = await successButton.allTextContents();
    await expect(text).toEqual("Data loaded with AJAX get request.")
});

test('timeouts', async ({ page }) => {

    test.slow(); //will make the test to wait 3 time longer than the default timeout
    const successButton = page.locator('.bg-success');
    await successButton.click();      
});