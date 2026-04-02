import { Locator, Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarDatePicker = this.page.getByPlaceholder("Form Picker")
        await calendarDatePicker.click();

        const dateToAssert = await this.selectDateInCalendar(numberOfDaysFromToday)
        expect(calendarDatePicker).toHaveValue(dateToAssert)
    }

    async selectDatePickerRangeFromToday(startDayFromToday: number, endDateFromToday: number) {
        const calendarDatePicker = this.page.getByPlaceholder("Range Picker")
        await calendarDatePicker.click();
        const dateToAssertStart = await this.selectDateInCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInCalendar(endDateFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`

        expect(calendarDatePicker).toHaveValue(dateToAssert)
    }

    private async selectDateInCalendar(numberOfDaysFromToday: number): Promise<string> {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString();
        const expectedMonthShot = date.toLocaleString('en-US', { month: 'short' });
        const expectedMonthLong = date.toLocaleString('en-US', { month: 'long' });
        const expectedYear = date.getFullYear();
        const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthYear = ` ${expectedMonthLong} ${expectedYear} `
        while (!calendarMonthAndYear.includes(expectedMonthYear)) {
            await this.page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']").click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click();

        return dateToAssert
    }
}