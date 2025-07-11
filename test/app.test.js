/**
* @vitest-environment happy-dom
*/

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Calendar from "../src/App.vue";

describe("Hello World! tests", () => {
  it("should render", () => {
    const wrapper = mount(Calendar);
  });
});