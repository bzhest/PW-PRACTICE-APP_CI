import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test.skip('Reusing test locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const emailField = basicForm.getByRole('textbox', { name: "Email" });

    await emailField.fill('test@test.com');
    await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123');
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button').click();

    expect(emailField).toHaveValue('test@test.com');
})

test('extract values', async ({ page }) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" });
    const buttonText = await basicForm.getByRole('button').textContent();
    expect(buttonText).toEqual('Submit');

    //all text values

    const allRadioButtonsText = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonsText).toContain('Option 1');

    //input values

    const emailField = basicForm.getByRole('textbox', { name: "Email" });
    await emailField.fill('test@test.com');
    const emailFieldValue = await emailField.inputValue();
    expect(emailFieldValue).toEqual('test@test.com');

    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');
})

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button');
    //General Assertion
    const number = 5;
    expect(number).toEqual(5);

    const buttonText = await basicFormButton.textContent();
    expect(buttonText).toEqual('Submit');
    //Locator Assertion
    await expect(basicFormButton).toHaveText('Submit'); //preferably is to use that Locator assertion, it will wait for 5 seconds 
//Soft Asertion
    await expect.soft(basicFormButton).toHaveText('Submit');
    await basicFormButton.click();
})      
