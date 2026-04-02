import { test } from '../test-opions';
import { PageManager } from '../page-objects/pageManager';
import { fa, faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('navigate to form page @smoke', async ({ page, pageManager}) => {
    await pageManager.navigateTo().datepickerPage();
})

test('Parametrized methods @smoke', async ({ page }) => {
    const randomFullName = faker.person.fullName({ sex: 'male' })
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentials(process.env.USEREMAIL, process.env.PASSWORD, "Option 1")
    await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})

test.only('testing with argos ci', async ({ page, pageManager}) => {
    await pageManager.navigateTo().formLayoutsPage();
    await pageManager.navigateTo().datepickerPage();
})