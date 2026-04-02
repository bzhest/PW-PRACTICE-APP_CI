import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Form Layouts page', () => {
    test.describe.configure({ retries: 0 })//assume that tests here a flacky, so we need to run them twice
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });


    test('input fields', async ({ page }, testInfo) => {
        if (testInfo.retry) {
            //do something, like DB cleanup
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" });
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 });

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    });

    test.only('radio buttons', async ({ page }) => {
        const usingTheRadioButtons = page.locator('nb-card', { hasText: "Using the Grid" })
        //await usingTheRadioButtons.getByLabel("Option 1").check({force: true});
        await usingTheRadioButtons.getByRole("radio", { name: "Option 1" }).check({ force: true });

        const radioStatus = await usingTheRadioButtons.getByLabel("Option 1").isChecked();
        await expect(usingTheRadioButtons).toHaveScreenshot()//first will generate a 'golden' screenshot (a baseline)

        /* expect(radioStatus).toBeTruthy();
        await expect(usingTheRadioButtons.getByLabel("Option 1")).toBeChecked(); */

        /* await usingTheRadioButtons.getByRole("radio", { name: "Option 2" }).check({ force: true });
        await expect(await usingTheRadioButtons.getByLabel("Option 1").isChecked()).toBeFalsy();
        await expect(await usingTheRadioButtons.getByLabel("Option 2").isChecked()).toBeTruthy(); */

    });

});

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole("checkbox", { name: "Hide on click" }).click({ force: true });//just do a click on the checkbox
    await page.getByRole("checkbox", { name: "Hide on click" }).check({ force: true });//will check the checkbox if it is not checked, if it is checked it will do nothing
    await page.getByRole("checkbox", { name: "Hide on click" }).uncheck({ force: true });//will check the checkbox if it is not checked, if it is unchecked it will do nothing

    //check all the checkboxes
    const checkboxes = page.getByRole("checkbox");
    for (const box of await checkboxes.all()) {
        await box.check({ force: true });
        expect(await box.isChecked()).toBeTruthy();
    }
});

test("Lists and dropdowns", async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    page.getByRole("list")//when the list has UL tag
    page.getByRole("listitem");//when the list has LI tag

    //const optionList = page.getByRole("list").locator('nb-option');
    const optionList = page.locator("nb-option-list nb-option");
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({ hasText: "Cosmic" }).click();
    const layoutHeader = page.locator('nb-layout-header');
    await expect(layoutHeader).toHaveCSS("background-color", "rgb(50, 50, 89)");

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropdownMenu.click();
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(layoutHeader).toHaveCSS("background-color", colors[color]);
        if (color != "Corporate")
            await dropdownMenu.click();
    }

});

test("tooltips", async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const tooltipCard = page.locator('nb-card', { hasText: "Tooltip Placements" });
    await tooltipCard.getByRole("button", { name: "Top" }).hover();

    const tooltipButton = page.getByRole("button", { name: "Default" });
    await tooltipButton.hover();
    const tooltip = await page.locator("nb-tooltip").textContent();
    expect(tooltip).toEqual("This is a tooltip");
});

test("dialog boxes", async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();
    //Create Listener to accept dialog
    page.on("dialog", dialog => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?");
        dialog.accept();
    });

    await page.getByRole("table").locator("tr", { hasText: "mdo@gmail.com" }).locator(".nb-trash").click();

    await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com");
});

test("Web tables", async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //Get the row by any text in the row
    const row = page.getByRole("row", { name: "twitter@outlook.com" });
    row.locator(".nb-edit").click();
    await page.locator("input-editor").getByPlaceholder("Age").clear();
    await page.locator("input-editor").getByPlaceholder("Age").fill("35");
    await page.locator(".nb-checkmark").click();

    //2 get the row by the value in the specific column
    await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
    const targetRowById = page.getByRole("row", { name: "11" }).filter({ has: page.locator("td").nth(1).getByText("11") });
    targetRowById.locator(".nb-edit").click();
    await page.locator("input-editor").getByPlaceholder("E-mail").clear();
    await page.locator("input-editor").getByPlaceholder("E-mail").fill("test@test.com");
    await page.locator(".nb-checkmark").click();
    await expect(targetRowById.locator("td").nth(5)).toHaveText("test@test.com");

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"];
    for (let age of ages) {
        await page.locator("input-filter").getByPlaceholder("Age").clear();
        await page.locator("input-filter").getByPlaceholder("Age").fill(age);
        await page.waitForTimeout(700);
        const agesRows = page.locator("tbody tr");

        for (let row of await agesRows.all()) {
            const cellValue = await row.locator("td").last().textContent();
            if (age == "200") {
                expect(await page.getByRole("table").textContent()).toContain("No data found");
            } else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});

test("datepicker", async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarDatePicker = page.getByPlaceholder("Form Picker")
    await calendarDatePicker.click();

    let date = new Date()
    date.setDate(date.getDate() + 200)
    const expectedDate = date.getDate().toString();
    const expectedMonthShot = date.toLocaleString('en-US', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('en-US', { month: 'long' });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthYear = ` ${expectedMonthLong} ${expectedYear} `
    while (!calendarMonthAndYear.includes(expectedMonthYear)) {
        await page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']").click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click();
    expect(calendarDatePicker).toHaveValue(dateToAssert)
});

test("Sliders", async ({ page }) => {

    // Approach - 1. Update attribute
    const tempGauge = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger circle")
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '232.6309')
        node.setAttribute('cy', '232.6309')
    })
    await tempGauge.click();

    //Approach - 2. Mouse movement
    const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger")
    await tempBox.scrollIntoViewIfNeeded();
    const box = await tempBox.boundingBox(); //creates a square box of element tempBox

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down() //simulates click ok left mouse button 
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();
    await expect(tempBox).toContainText("30")
})