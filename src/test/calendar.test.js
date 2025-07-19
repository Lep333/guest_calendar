import { mount } from "@vue/test-utils";
import app from "../GuestCalendar.vue";
import { describe, expect, test } from "vitest";
import { end } from "happy-dom/lib/PropertySymbol.js";


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

    test("weekday captions render correctly", async () => {
        const wrapper = mount(app);
        await wrapper.vm.$nextTick();

        let weekdayCaptions = wrapper.findAll(".weekdayCaption");
        expect(weekdayCaptions.length).toBe(7);
        for (let i = 0; i < 7; i++) {
            let expectedDayCaption = wrapper.vm.getDays[i].toLocaleString("default", { weekday: "long" });
            expect(weekdayCaptions[i].text()).toBe(expectedDayCaption);
        }
    });

    test("numeric day captions render correctly", async () => {
        const wrapper = mount(app);
        await wrapper.vm.$nextTick();

        let weekdayCaptions = wrapper.findAll(".dayCaption");
        let daysToDisplay = wrapper.vm.getDays.length;
        expect(weekdayCaptions.length).toBe(daysToDisplay);
        for (let i = 0; i < daysToDisplay; i++) {
            let expectedDayCaption = wrapper.vm.getDays[i].getDate();
            expect(weekdayCaptions[i].text()).toBe(String(expectedDayCaption));
        }
    });

    test("numeric day captions of current month are rendered in bold", async () => {
        const wrapper = mount(app);
        await wrapper.vm.$nextTick();

        let boldCaptions = wrapper.findAll(".currentMonth");
        let currentDay = new Date();
        let lastDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0);
        let daysInMonth = lastDayOfMonth.getDate();
        expect(boldCaptions.length).toBe(daysInMonth);
    })

    test("numeric day captions of month last year are rendered in bold", async () => {
        const wrapper = mount(app);
        await wrapper.vm.$nextTick();

        for (let i = 0; i < 12; i++) {
            await wrapper.find("#prevMonth").trigger("click");
        }

        let boldCaptions = wrapper.findAll(".currentMonth");
        let currentDay = new Date();
        let lastDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0);
        let daysInMonth = lastDayOfMonth.getDate();
        expect(boldCaptions.length).toBe(daysInMonth);
    })

    test("numeric day captions of month next year are rendered in bold", async () => {
        const wrapper = mount(app);
        await wrapper.vm.$nextTick();

        for (let i = 0; i < 12; i++) {
            await wrapper.find("#nextMonth").trigger("click");
        }

        let boldCaptions = wrapper.findAll(".currentMonth");
        let currentDay = new Date();
        let lastDayOfMonth = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0);
        let daysInMonth = lastDayOfMonth.getDate();
        expect(boldCaptions.length).toBe(daysInMonth);
    })

    test("event rendered correctly: starts before curr month ends in curr month", async () => {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth() - 1);
        let endDate = new Date(today.getFullYear(), today.getMonth());
        const events = [
            { id: 1, room: 1, start: startDate, end: endDate },
        ];
        const wrapper = mount(app, {props: {events}});

        let found_events = wrapper.findAll(".event");
        let expected_no_of_events = 1;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event rendered correctly: starts before curr month ends after curr month", async () => {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth() - 1);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1);
        let events = [
            { id: 1, room: 1, start: startDate, end: endDate },
        ];
        const wrapper = mount(app, {props: {events}});

        let found_events = wrapper.findAll(".event");
        let expected_no_of_events = wrapper.vm.getDays.length / 7;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event rendered correctly: starts curr month ends after curr month", async () => {
        let today = new Date();
        let startDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        let endDate = new Date(today.getFullYear(), today.getMonth() + 1);
        let events = [
            { room: 1, start: startDate, end: endDate },
        ];
        const wrapper = mount(app, {props: {events}});


        await wrapper.vm.$nextTick();

        let found_events = wrapper.findAll(".event");
        let expected_no_of_events = 1;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event rendered correctly: starts curr month ends curr month", async () => {
        const wrapper = mount(app);
        let today = new Date();
        let startDate = wrapper.vm.getDays[7];
        let endDate = wrapper.vm.getDays[13];
        let events = [
            { room: 1, start: startDate, end: endDate },
        ];
        await wrapper.setProps({events: events});

        let found_events = wrapper.findAll(".event");
        let expected_no_of_events = 1;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event rendered correctly: starts curr month ends curr month; 2week long event", async () => {
        const wrapper = mount(app);

        let startDate = wrapper.vm.getDays[7];
        let endDate = wrapper.vm.getDays[20];
        let events = [
            { room: 1, start: startDate, end: endDate },
        ];
        await wrapper.setProps({events: events});

        let found_events = wrapper.findAll(".room1");
        let expected_no_of_events = 2;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event rendered correctly: room2", async () => {
        const wrapper = mount(app);

        let startDate = wrapper.vm.getDays[7];
        let endDate = wrapper.vm.getDays[20];
        let events = [
            { room: 2, start: startDate, end: endDate },
        ];
        await wrapper.setProps({events: events});

        let found_events = wrapper.findAll(".room2");
        let expected_no_of_events = 2;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event rendered correctly: room3", async () => {
        const wrapper = mount(app);

        let startDate = wrapper.vm.getDays[7];
        let endDate = wrapper.vm.getDays[20];
        const events = [
            { room: 3, start: startDate, end: endDate },
        ];
        await wrapper.setProps({events: events});

        let found_events = wrapper.findAll(".room3");
        let expected_no_of_events = 2;
        expect(found_events.length).toBe(expected_no_of_events);
    })

    test("event detail windows opens and closes. Also correct details info is shown", async () => {
        const wrapper = mount(app);

        let startDate = wrapper.vm.getDays[7];
        let endDate = wrapper.vm.getDays[20];
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        const events = [
            { room: 3, start: startDate, end: endDate },
        ];
        await wrapper.setProps({events: events});

        expect(wrapper.find(".eventWindow").exists()).toBe(false);
        await wrapper.find(".event").trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".eventWindow").exists()).toBe(true);

        let details = wrapper.findAll(".eventDetail");
        expect(details.length).toBe(6);
        expect(details[0].text()).toBe("room");
        expect(details[1].text()).toBe("3");
        expect(details[2].text()).toBe("start");
        expect(details[3].text()).toBe(startDate.toLocaleString(undefined, options));
        expect(details[4].text()).toBe("end");
        expect(details[5].text()).toBe(endDate.toLocaleString(undefined, options));

        await wrapper.find("#imgClose").trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".eventWindow").exists()).toBe(false);
    })
});