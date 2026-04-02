import { test } from '../test-opions';
import { faker } from '@faker-js/faker'

test('Parametrized methods', async ({ page, formLayoutsPage, pageManager }) => {
    const randomFullName = faker.person.fullName({ sex: 'male' })
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`

    await pageManager.onFormLayoutPage().submitUsingTheGridFormWithCredentials(process.env.USEREMAIL, process.env.PASSWORD, "Option 1")
    await pageManager.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})