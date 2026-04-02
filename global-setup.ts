import { request, expect } from "@playwright/test";
import user from './tests/apiTests/.auth/user.json'
import fs from 'fs'

async function globalSetup() {

    const context = await request.newContext();
    const authFile = 'tests/apiTests/.auth/user.json'

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": { "email": "bzhest@test.com", "password": "bzhest1987" }
        }
    })

    const responseBody = await responseToken.json();
    const token = responseBody.user.token

    user.origins[0].localStorage[0].value = token
    fs.writeFileSync(authFile, JSON.stringify(user, null, 2))

    process.env['ACCESS_TOKEN'] = token


    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": { "title": "Global Likes test articles", "description": "About1", "body": "some text", "tagList": [] }
        },
        headers:{
            Authorization: `Token ${token}`
        }
    })
    expect(articleResponse.status()).toEqual(201)
    const response = await articleResponse.json();
    const slugId = response.article.slug;
    process.env['SLUGID'] = slugId
}

export default globalSetup;