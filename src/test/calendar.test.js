import { mount } from "@vue/test-utils";
import app from "../App.vue";
import { describe, expect, test } from "vitest";


describe("App.vue", () => {
    test("curr month renders correctly", () => {
        const currMonthString = new Date().toLocaleString("default", { month: "long" });
        const wrapper = mount(app);
        expect(wrapper.find(".monthCaption").text()).toEqual(currMonthString);
    });

    test("go to prev month", async () => {
        const currMonth = new Date();
        currMonth.setMonth(currMonth.getMonth() - 1);
        const prevMonthString = currMonth.toLocaleString("default", { month: "long" });
        const wrapper = mount(app);
        await wrapper.find("#prevMonth").trigger("click");
        expect(wrapper.find(".monthCaption").text()).toEqual(prevMonthString);
    })

    test("go to next month", async () => {
        const currMonth = new Date();
        currMonth.setMonth(currMonth.getMonth() + 1);
        const nextMonthString = currMonth.toLocaleString("default", { month: "long" });
        const wrapper = mount(app);
        await wrapper.find("#nextMonth").trigger("click");
        expect(wrapper.find(".monthCaption").text()).toEqual(nextMonthString);
    })
});