import { test as setup } from '@playwright/test';
import fs from 'fs'

const authFile = 'tests/apiTests/.auth/user.json'

setup('Authentification', async ({ page, request }) => {
   /*  await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText("Sign in").click()
    await page.getByRole('textbox', { name: "Email" }).fill('bzhest@test.com')
    await page.getByRole('textbox', { name: "Password" }).fill('bzhest1987')
    await page.getByRole('button').click()
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags') */
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": { "email": "bzhest@test.com", "password": "bzhest1987" }
        }
    })

    const responseBody = await response.json();
    const token = responseBody.user.token

    const user = JSON.parse(fs.readFileSync(authFile, 'utf8'));
    user.origins[0].localStorage[0].value = token
    fs.writeFileSync(authFile, JSON.stringify(user, null, 2))

    process.env['ACCESS_TOKEN'] = token
})
